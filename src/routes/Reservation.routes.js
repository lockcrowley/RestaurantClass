const router = require('express').Router();

const ReservationController = require('../controllers/Reservation.controller.js');

router.post('/create', ReservationController.createReservation);

router.put('/update/:id', ReservationController.updateReservation);

router.get('/', ReservationController.getReservations);

router.delete('/delete/:id', ReservationController.deleteReservation);

module.exports = router;