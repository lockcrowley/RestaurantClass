const { Schema, model, Types } = require('mongoose');

const ReservationSchema = new Schema({
  table: {
    type: Types.ObjectId,
    ref: 'tables',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerDocument: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['RESERVED', 'CANCELLED', 'FINISHED'],
    default: 'RESERVED'
  }
});
module.exports = model('reservations', ReservationSchema);