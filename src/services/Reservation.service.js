const Reservation = require('../models/Reservation.model.js');
const Table = require('../models/Table.model.js');
const RestaurantConfig = require('../models/RestaurantConfig.model.js');
const isWithinOpeningHoursUTC = require('../utils/isWithinOpeningHours.util.js');

class ReservationService {
  async create({ tableNumber, reservationTime, customerName, customerDocument }) {

    const {
      startAt,
      endAt
    } = reservationTime;
    
    const table = await Table.findOne({
      tableNumber
    });

    if (!table) {
      throw new Error('Table not found');
    }

    const conflict = await Reservation.findOne({
      table: table._id,
      status: { $in: ['RESERVED', 'OCCUPIED'] },

      startAt: { $lt: endAt },
      endAt: { $gt: startAt }
    });

    if (conflict) throw new Error('Table already reserved for this time range');

    const { openingHours: { open, close } } = await RestaurantConfig.findOne();

    if (
      !isWithinOpeningHoursUTC(startAt, open, close) ||
      !isWithinOpeningHoursUTC(endAt, open, close)
    ) {
      throw new Error('Reservation outside opening hours');
    }

    return await Reservation.create({
      table: table._id,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      customerName,
      customerDocument
    });
  }

  updateReservationStatus(reservationId, status) {
    const validStatuses = ['RESERVED', 'CANCELLED', 'FINISHED'];

    if (!validStatuses.includes(status)) throw new Error('Invalid reservation status');

    return Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    );
  }
  
  async getAllReservations({ customerDocument, tableId }) {
    const filter = customerDocument ? { customerDocument } : tableId ? { table: tableId } : {};
  
    return await Reservation.find(filter);
  }

  async deleteReservationById({ reservationId }) {
    await Reservation.findByIdAndDelete(reservationId);
    return 'Reservation deleted successfully';
  }
}

module.exports = new ReservationService();