const Order = require('../models/Order.model');
const Table = require('../models/Table.model');
const Reservation = require('../models/Reservation.model');
const isNowWithinReservation = require('../utils/isNowWithinReservation.util.js'); 

class OrderService {
  async create({ tableNumber, customerDocument, items, waiter }) {
  
    const table = await Table.findOne({
      tableNumber
    });

    if (!table) {
      throw new Error('Table not found');
    }

    const now = new Date();

    const customerReservation  = await Reservation.findOne({
      status: 'RESERVED',
      customerDocument
    });

    const tableReservation = await Reservation.findOne({
      table: table._id,
      status: 'RESERVED',
      startAt: { $lte: now },
      endAt: { $gte: now }
    });

    if (
      tableReservation &&
      tableReservation.customerDocument !== customerDocument
    ) throw new Error('Table is reserved for another customer at this time');

    if (
      customerReservation &&
      customerReservation.table.toString() !== table._id.toString()
    ) throw new Error('Reservation does not belong to the informed table');

    if (
      customerReservation &&
      !isNowWithinReservation(customerReservation)
    ) throw new Error('Order outside reservation time range');

    if (table.status === 'OCCUPIED') throw new Error('Table is currently occupied');
    
    const totalPrice = items.reduce((total, item) => {
      item.name = item.name.toLowerCase();
      return total + (item.price * item.quantity);
    }, 0);

    const orderCreated = await Order.create({
      table: table._id,
      reservation: customerReservation?._id || null,
      items,
      totalPrice,
      waiter
    });

    await Table.findByIdAndUpdate(table._id, {
      status: customerReservation  ? 'RESERVED' : 'OCCUPIED',
      currentOrder: orderCreated._id,
      updatedAt: Date.now()
    });

    return orderCreated;
  }

  async updateItemsAtOrder({ orderId, items, waiter }) {
    if (!orderId) {
      throw new Error('Order ID is required to update the order');
    }

    for (const item of items) {
      item.name = item.name.toLowerCase();

      const result = await Order.updateOne(
        {
          _id: orderId,
          'items.name': item.name
        },
        {
          $inc: {
            'items.$.quantity': item.quantity,
            totalPrice: item.price * item.quantity
          },
          $set: { waiter }
        }
      );

      if (result.matchedCount === 0) {
        await Order.updateOne(
          { _id: orderId },
          {
            $push: { items: item },
            $inc: { totalPrice: item.price * item.quantity },
            $set: { waiter }
          }
        );
      }
    }

    const table = await Table.findOne({ currentOrder: orderId });

    if (table && table.status === 'RESERVED') {
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
      item.name = item.name.toLowerCase();

      // decrementa quantidade e total
      const result = await Order.updateOne(
        {
          _id: orderId,
          'items.name': item.name
        },
        {
          $inc: {
            'items.$.quantity': -item.quantity,
            totalPrice: -(item.price * item.quantity)
          }
        }
      );

      // remove itens com quantidade <= 0
      if (result.matchedCount > 0) {
        await Order.updateOne(
          { _id: orderId },
          {
            $pull: {
              items: { quantity: { $lte: 0 } }
            }
          }
        );
      }
    }
    await Order.updateOne(
      { _id: orderId },
      {
        $max: { totalPrice: 0 }
      }
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

  async getAllOrders({ tableId }) {
    const filter = tableId ? { table: tableId } : {};

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