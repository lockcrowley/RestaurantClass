const Order = require('../models/Order.model');
const Table = require('../models/Table.model');
const Reservation = require('../models/Reservation.model');
const isNowWithinReservation = require('../utils/isNowWithinReservation.util.js'); 

class OrderService {
  async create({ order }) {
    const {
      tableNumber,
      customerDocument,
      items,
      waiter
    } = order;

    const table = await Table.findOne({
      tableNumber
    });

    if (!table) {
      throw new Error('Table not found');
    }

    const reservation = await Reservation.findOne({
      status: 'RESERVED',
      customerDocument
    });

    if(reservation && reservation.table.toString() !== table._id.toString()) {
      throw new Error('Reservation does not belong to the informed table');
    }

    if(reservation && !isNowWithinReservation(reservation)) {
      throw new Error('Order outside reservation time range');
    }

    if(table.status !== 'FREE') {
      throw new Error('Table is currently occupied');
    }

    const totalPrice = items.reduce((total, item) => {
      item.name = item.name.toLowerCase();
      return total + (item.price * item.quantity);
    }, 0);

    const orderCreated = await Order.create({
      table: table._id,
      reservation: reservation?._id || null,
      items,
      totalPrice,
      waiter
    });

    await Table.findByIdAndUpdate(table._id, {
      status: reservation ? 'RESERVED' : 'OCCUPIED',
      currentOrder: orderCreated._id,
      updatedAt: Date.now()
    });

    return orderCreated;
  }

  async updateItemsAtOrder({ orderId, items, waiter }) {
    if(!orderId) {
      throw new Error('Order ID is required to update the order');
    }

    for (const item of items) {
      const result = await Order.findByIdAndUpdate(
        { _id: orderId,
          'items.name': item.name.toLowerCase()
        },
        {
          $inc: {
            'items.$.quantity': item.quantity,
            totalPrice: item.price * item.quantity
          },
          waiter
        }
      );

      if (result.matchedCount === 0) {
        await Order.findByIdAndUpdate(
          { _id: orderId },
          {
            $push: { items: item },
            $inc: { totalPrice: item.price * item.quantity }
          }
        );
      }
    }

    const table = await Table.findOne({ currentOrder: orderId });

    if (table.status === 'RESERVED') {
      await Table.findByIdAndUpdate(table._id, {
        status: 'OCCUPIED',
        updatedAt: Date.now()
      });
    }

    return 'Order updated successfully';
  }

  async removeItemsFromOrder({ orderId, items }) {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    for (const item of items) {
      await Order.findOneAndUpdate(
        {
          _id: orderId,
          'items.name': item.name.toLowerCase()
        },
        {
          $inc: {
            'items.$.quantity': -item.quantity,
            totalPrice: -(item.price * item.quantity)
          }
        }
      );

      await Order.findByIdAndUpdate(
        orderId,
        {
          $pull: {
            items: { quantity: { $lte: 0 } }
          }
        }
      );
    }

    await Order.findByIdAndUpdate(
      orderId,
      [
        {
          $set: {
            totalPrice: {
              $cond: [
                { $lt: ['$totalPrice', 0] },
                0,
                '$totalPrice'
              ]
            }
          }
        }
      ]
    );

    return 'Items removed successfully';
  }


  async completeOrder({ orderId }) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error('Order not found');

    if (order.orderCompleted) throw new Error('Order is already completed');

    await Table.findOneAndUpdate(
      { currentOrder: order._id },
      { 
        status: 'FREE', 
        currentOrder: null, 
        updatedAt: Date.now() 
      }
    );
   
    await Order.findByIdAndUpdate(orderId, { orderCompleted: true });

    return 'Order completed successfully';
  }

  async getAllOrders({ tableNumber}) {
    const filter = tableNumber ? { tableNumber: Number(tableNumber) } : {};

    return await Order.find(filter); 
  }

  async getOrderById({ orderId }) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error('Order not found');

    return order;
  }

  async deleteOrderById({ orderId }) {
    await Order.findByIdAndDelete(orderId); 
  }

  async deleteOrderByTableId({ tableId }) {
    await Order.deleteOne({ table: tableId }); 
  }
}

module.exports = new OrderService();