const router = require('express').Router();

router.use('/orders', require('./Order.routes.js'));
router.use('/tables', require('./Table.routes.js'));

module.exports = router;