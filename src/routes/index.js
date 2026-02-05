const router = require('express').Router();

router.use('/orders', require('./Order.routes.js'));
router.use('/tables', require('./Table.routes.js'));
router.use('/restaurant-config', require('./RestaurantConfig.routes.js'));

module.exports = router;