const Reservation = require('../models/Reservation.model.js');
const Table = require('../models/Table.model.js');
const isWithinOpeningHoursUTC = require('../utils/isWithinOpeningHours.util.js');

class ReservationService {
  async create({ tableId, reservationTime, customerName, customerDocument }) {

    const {
      startAt,
      endAt
    } = reservationTime;

    if (
      !isWithinOpeningHoursUTC(startAt) ||
      !isWithinOpeningHoursUTC(endAt)
    ) {
      throw new Error('Reservation outside opening hours');
    }

    return await Reservation.create({
      table: tableId,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      customerName,
      customerDocument
    });
  }   
}

module.exports = new ReservationService();