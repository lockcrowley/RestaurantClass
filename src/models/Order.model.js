const { Schema, model, Types } = require('mongoose');
const { randomUUID } = require('crypto');

const OrderSchema = new Schema({
   customerName: { 
    type: String, 
    required: true 
  },

  table: {
    type: Types.ObjectId,
    ref: 'tables',
    required: true
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