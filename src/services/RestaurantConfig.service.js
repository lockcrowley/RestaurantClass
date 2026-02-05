const RestaurantConfigModel = require('../models/RestaurantConfig.model');

class RestaurantConfigService {
  async getRestaurantConfig() {
    let config = await RestaurantConfigModel.findOne();
    
    if (!config) {
      config = await RestaurantConfigModel.create({
        openingHours: { open: "17:00", close: "23:00" }
      });
    }

    return config;
  }

  async updateRestaurantConfig({ openingHours }) {
    const config = await this.getRestaurantConfig();
    config.openingHours = openingHours;

    await config.save();

    return config;
  }
}

module.exports = new RestaurantConfigService();