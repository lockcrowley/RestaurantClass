const RestaurantConfig = require('../models/RestaurantConfig.model.js');

module.exports = (dateUTC) => {
  const { openingHours: { open, close } } = RestaurantConfig.findOne();

  const localDate = new Date(
    dateUTC.getTime() - (3 * 60 * 60 * 1000)
  );

  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);

  const minutes =
    localDate.getHours() * 60 + localDate.getMinutes();

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return minutes >= openMinutes && minutes <= closeMinutes;
}

