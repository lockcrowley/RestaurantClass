const { Schema, model, Types } = require('mongoose');

const TableSchema = new Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },

  location: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['FREE', 'OCCUPIED', 'RESERVED'],
    default: 'FREE'
  },

  currentOrder: {
    type: Types.ObjectId,
    ref: 'orders',
    default: null
  },

  capacity: {
    type: Number,
    required: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('tables', TableSchema);