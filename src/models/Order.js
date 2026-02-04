const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto');

const OrderSchema = new Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  tableNumber: { 
    type: Number, 
    required: true 
  },
  items: [{ 
    sku: {
      type: String,
      default: () => randomUUID()
    },
    name: { 
      type: String, 
      required: true 
    },
    mainCourse:{
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
  orderCompleted: {
    type: Boolean,
    default: false
  },
  totalPrice: { 
    type: Number, 
    required: true 
  }
});

module.exports = model('Order', OrderSchema);