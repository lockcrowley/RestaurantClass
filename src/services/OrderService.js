const Order = require('../models/Order');

class OrderService {
  async create({ order }) {
    const {
      customerName,
      customerDocument,
      tableNumber,
      items
    } = order;

    const orderAlreadyExistsToTable = await Order.findOne({
      tableNumber
    });

    if (orderAlreadyExistsToTable) {
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
    if(!customerDocument && !tableNumber) {
      throw new Error('Customer document and table number is required to update the order');
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

  async getAllOrders() {
    return await Order.find(); 
  }

  async getOrderByCustomerDocument({ customerDocument }) {
    return await Order.findOne({ customerDocument });
  }

  async getOrderByTableNumber({ tableNumber }) {
    return await Order.findOne({ tableNumber }); 
  }

  async getOrderById({ orderId }) {
    return await Order.findById(orderId); 
  }

  async deleteOrderById({ orderId }) {
    await Order.findByIdAndDelete(orderId); 
  }

  async deleteOrderByDocumentAndTableNumber({ customerDocument, tableNumber }) {
    await Order.deleteOne({ customerDocument, tableNumber }); 
  }
}

module.exports = new OrderService();