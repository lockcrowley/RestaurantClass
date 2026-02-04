const Order = require('../models/Order.model');
const Table = require('../models/Table.model');

class OrderService {
  async create({ order }) {
    const {
      customerName,
      customerDocument,
      tableNumber,
      items,
      waiter
    } = order;

    const table = await Table.findOne({
      tableNumber
    });

    if(table.status !== 'FREE') throw new Error('Table is not available');

    let totalPrice = 0;

    if(items.length) { 
      totalPrice = items.reduce((total, item) => {
        item.name = item.name.toLowerCase();
        return total + (item.price * item.quantity);
      }, 0);
    }

    return await Order.create({
      customerName,
      customerDocument,
      tableNumber,
      items,
      reserved: items.length === 0,
      totalPrice,
      waiter
    });
  }

  async update({ tableNumber, items, waiter }) {
    if(!tableNumber) {
      throw new Error('Table number is required to update the order');
    }

    for (const item of items) {
      const result = await Order.updateOne(
        {
          tableNumber,
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
        await Order.updateOne(
          { customerDocument, tableNumber },
          {
            $push: { items: item },
            $inc: { totalPrice: item.price * item.quantity }
          }
        );
      }
    }

    return 'Order updated successfully';
  }

  async completeOrder({ orderId }) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error('Order not found');

    if (order.orderCompleted) throw new Error('Order is already completed');
   
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

  async deleteOrderByTableNumber({ tableNumber }) {
    await Order.deleteOne({ tableNumber: Number(tableNumber) }); 
  }
}

module.exports = new OrderService();