const mongoose = require('mongoose');

const bookingschema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number
  },
  payed: {
    type: String,
    default: true
  },
  quantity: {
    type: String,
    default: 1
  },
  date: { type: Date, default: Date.now }
});
bookingschema.index({ user: 1, tour: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingschema);

module.exports = Booking;
