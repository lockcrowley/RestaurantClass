const ReservationService = require('../services/Reservation.service.js');

class ReservationController {
  async createReservation(req, res) {
    try {
      const { 
        tableNumber, 
        reservationTime, 
        customerName, 
        customerDocument 
      } = req.body; 

      const reservationCreated = await ReservationService.create({
        tableNumber,
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

  async updateReservation(req, res) {
    try {
      const reservationId = req.params.id;
      const { status } = req.body;

      const updatedReservation = await ReservationService.updateReservationStatus(reservationId, status);

      res.status(200).json({
        message: "Reservation status updated successfully",
        reservation: updatedReservation
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getReservations(req, res) {
    try {
      const { customerDocument, tableId } = req.query;

      const reservations = await ReservationService.getAllReservations({ customerDocument, tableId });
      
      res.status(200).json({
        reservations
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async deleteReservation(req, res) {
    try {
      const reservationId = req.params.id;

      const result = await ReservationService.deleteReservationById({ reservationId });

      res.status(200).json({
        message: result
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    } 
  }
}

module.exports = new ReservationController();