const { Schema, model } = require('mongoose');

const RestaurantConfigSchema = new Schema({
  openingHours: {
    open: {
      type: String,
      default: "17:00"
    },
    close: {
      type: String,
      default: "23:00"
    }
  }
});

module.exports = model('restaurantConfigs', RestaurantConfigSchema);