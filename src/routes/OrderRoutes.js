const router = require('express').Router();

const OrderController = require('../controllers/OrderController.js');

router.post('/create', OrderController.createOrder);

router.put('/update/:customerDocument/:tableNumber', OrderController.updateOrder);

router.get('/all', OrderController.getOrders);

router.get('/customer/:customerDocument', OrderController.getOrderByCustomerDocument);

router.get('/table/:tableNumber', OrderController.getOrderByTableNumber);

router.get('/id/:orderId', OrderController.getOrderById);

router.delete('/delete/:orderId', OrderController.deleteOrderById);

router.delete('/delete/:customerDocument/:tableNumber', OrderController.deleteOrderByDocumentAndTableNumber);

module.exports = router;