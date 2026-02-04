const OrderService = require('../services/Order.service.js');

class OrderController {
  async createOrder(req, res) {
    try {
      const orderCreated = await OrderService.create({ order: req.body });

      res.status(201).json({
        message: "Order created successfully", 
        order: orderCreated 
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async updateOrder(req, res) {
    try {
      const tableNumber = req.params.tableNumber;
      const { items, waiter } = req.body;

      const result = await OrderService.update({ 
        tableNumber, 
        items,
        waiter
      });

      res.status(200).json({
        message: result
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async completeOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      const result = await OrderService.completeOrder({ orderId });

      res.status(200).json({
        message: result
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getOrders(req, res) {
    try {
      const { tableNumber } = req.query;

      const orders = await OrderService.getAllOrders({ tableNumber});
      res.status(200).json({
        orders
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const orderId = req.params.orderId; 
      const order = await OrderService.getOrderById({ orderId });
      res.status(200).json({
        order
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async deleteOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      await OrderService.deleteOrderById({ orderId });

      res.status(200).json({
        message: 'Order deleted successfully'
      });
    } catch (error) { 
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async deleteOrderByTableNumber(req, res) {
    try {
      const { tableNumber } = req.params;

      await OrderService.deleteOrderByTableNumber({ tableNumber });

      res.status(200).json({
        message: 'Order deleted successfully'
      });
    } catch (error) { 
      res.status(500).json({
        error: error.message 
      });
    }
  }
}

module.exports = new OrderController();