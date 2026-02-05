const ReservationService = require('../services/Reservation.service.js');

class ReservationController {
  async createReservation(req, res) {
    try {
      const { 
        tableId, 
        reservationTime, 
        customerName, 
        customerDocument 
      } = req.body; 

      const reservationCreated = await ReservationService.create({
        tableId,
        reservationTime,
        customerName,
        customerDocument
      }); 

      res.status(201).json({
        message: "Reservation created successfully", 
        reservation: reservationCreated 
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }
}

module.exports = new ReservationController();