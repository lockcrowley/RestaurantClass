const OrderService = require('../services/Order.service.js');

class OrderController {
  async createOrder(req, res) {
    try {
      const {
        tableNumber,
        customerDocument,
        items,
        waiter
      } = req.body;

      const orderCreated = await OrderService.create({ tableNumber, customerDocument, items, waiter });

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

  async updateOrderItems(req, res) {
    try {
      const orderId = req.params.id;
      const { items, waiter } = req.body;

      const result = await OrderService.updateItemsAtOrder({ 
        orderId, 
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

  async removeItemsFromOrder(req, res) {
    try {
      const orderId = req.params.id;
      const { items } = req.body;

      const result = await OrderService.removeItemsFromOrder({
        orderId,
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

  async completeOrder(req, res) {
    try {
      const orderId = req.params.id;

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
      const { tableId } = req.query;

      const orders = await OrderService.getAllOrders({ tableId });

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
      const orderId = req.params.id; 

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
      const orderId = req.params.id;

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

  async deleteOrderByTableId(req, res) {
    try {
      const { tableId } = req.params;

      await OrderService.deleteOrderByTableId({ tableId });

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