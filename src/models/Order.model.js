const { Schema, model, Types } = require('mongoose');
const { randomUUID } = require('crypto');

const OrderSchema = new Schema({
  table: {
    type: Types.ObjectId,
    ref: 'tables',
    required: true
  },

  reservation: {
    type: Types.ObjectId,
    ref: 'reservations',
    required: false
  },

  items: {
    type: [{
      sku: {
        type: String,
        default: () => randomUUID()
      },
      name: {
        type: String,
        required: true
      },
      mainCourse: {
        type: Boolean,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }],
    default: []
  },

  orderCompleted: {
    type: Boolean,
    default: false
  },

  totalPrice: { 
    type: Number, 
    required: true 
  },

  waiter: {
    type: String
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = model('orders', OrderSchema);