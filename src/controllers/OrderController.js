const OrderService = require('../services/OrderService.js');

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
      const customerDocument = req.params.customerDocument;
      const tableNumber = req.params.tableNumber;
      const items = req.body.items;

      const result = await OrderService.update({ 
        customerDocument,
        tableNumber, 
        items
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

  async getOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        orders
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getOrderByCustomerDocument(req, res) {
    try {
      const customerDocument = req.params.customerDocument;

      const order = await OrderService.getOrderByCustomerDocument({ customerDocument });
      res.status(200).json({
        order
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getOrderByTableNumber(req, res) {
    try {
      const tableNumber = req.params.tableNumber;
      const order = await OrderService.getOrderByTableNumber({ tableNumber });
      res.status(200).json({
        order
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

  async deleteOrderByDocumentAndTableNumber(req, res) {
    try {
      const customerDocument = req.params.customerDocument;
      const tableNumber = req.params.tableNumber;

      await OrderService.deleteOrder({ customerDocument, tableNumber });

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