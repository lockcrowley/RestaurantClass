const router = require('express').Router();

const OrderController = require('../controllers/OrderController.js');

router.post('/create', OrderController.createOrder);

router.put('/update/:tableNumber', OrderController.updateOrder);

router.put('/complete/:orderId', OrderController.completeOrder);

router.get('/', OrderController.getOrders);

router.get('/id/:orderId', OrderController.getOrderById);

router.delete('/delete/:orderId', OrderController.deleteOrderById);

router.delete('/delete/:tableNumber', OrderController.deleteOrderByTableNumber);

module.exports = router;