const router = require('express').Router();

const OrderController = require('../controllers/Order.controller.js');

router.post('/create', OrderController.createOrder);

router.put('/update/:id', OrderController.updateOrderItems);

router.put('/cancel-items/:id', OrderController.removeItemsFromOrder);

router.put('/complete/:id', OrderController.completeOrder);

router.get('/', OrderController.getOrders);

router.get('/id/:id', OrderController.getOrderById);

router.delete('/delete/:id', OrderController.deleteOrderById);

router.delete('/delete/:tableId', OrderController.deleteOrderByTableId);

module.exports = router;