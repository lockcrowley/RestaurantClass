const router = require('express').Router();

const OrderController = require('../controllers/OrderController.js');

router.post('/create', OrderController.createOrder);

router.put('/update/:customerDocument/:tableNumber', OrderController.updateOrder);

router.get('/', OrderController.getOrders);

router.get('/id/:orderId', OrderController.getOrderById);

router.delete('/delete/:orderId', OrderController.deleteOrderById);

router.delete('/delete/:customerDocument/:tableNumber', OrderController.deleteOrderByDocumentAndTableNumber);

module.exports = router;