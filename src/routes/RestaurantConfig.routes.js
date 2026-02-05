const router = require('express').Router();

const RestaurantConfigController = require('../controllers/RestaurantConfig.controller.js');

router.put('/update', RestaurantConfigController.updateRestaurantConfig);

router.get('/', RestaurantConfigController.getRestaurantConfig);

module.exports = router;