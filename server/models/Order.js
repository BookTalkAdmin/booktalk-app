const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
