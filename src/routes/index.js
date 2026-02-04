const router = require('express').Router();

router.use('/orders', require('./OrderRoutes.js'));

module.exports = router;