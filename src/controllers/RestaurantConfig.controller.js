const RestaurantConfigService = require('../services/RestaurantConfig.service');

class RestaurantConfigController {
  async getRestaurantConfig(req, res) {
    try {
      const config = await RestaurantConfigService.getRestaurantConfig();

      res.status(200).json({
        config
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async updateRestaurantConfig(req, res) {
    try {
      const { openingHours } = req.body;

      const updatedConfig = await RestaurantConfigService.updateRestaurantConfig({ openingHours });

      res.status(200).json({
        message: "Restaurant config updated successfully",
        config: updatedConfig
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }
}

module.exports = new RestaurantConfigController();