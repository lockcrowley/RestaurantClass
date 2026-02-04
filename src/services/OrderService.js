const Order = require('../models/Order');

class OrderService {
  async create({ order }) {
    const {
      customerName,
      customerDocument,
      tableNumber,
      items
    } = order;

    const orderAlreadyExistsToTable = await Order.find({
      tableNumber
    });

    const orderAlreadyCompleted = orderAlreadyExistsToTable.find(order => !order.orderCompleted);

    if (orderAlreadyCompleted) {
      throw new Error('There is already an order for this table number');
    }

    const totalPrice = items.reduce((total, item) => {
      item.name = item.name.toLowerCase();
      return total + (item.price * item.quantity);
    }, 0);

    return await Order.create({
      customerName,
      customerDocument,
      tableNumber,
      items,
      totalPrice
    });
  }

  async update({ customerDocument, tableNumber, items }) {
    if(!tableNumber) {
      throw new Error('Table number is required to update the order');
    }

    for (const item of items) {
      const result = await Order.updateOne(
        {
          customerDocument,
          tableNumber,
          'items.name': item.name.toLowerCase()
        },
        {
          $inc: {
            'items.$.quantity': item.quantity,
            totalPrice: item.price * item.quantity
          }
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