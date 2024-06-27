const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user!']
  },
  places: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Place',
      required: [true, 'Booking must have at least one place!']
    }
  ],
  date: {
    type: Date,
    required: [true, 'Booking must have a date!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  paid: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'declined', 'accepted', 'paid'],
    default: 'pending'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;