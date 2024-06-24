const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour Guide!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  places: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Place'
    }
  ],
  date: {
    type: Date,
    required: [true, 'Booking must have a date.']
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});

bookingSchema.pre('save', async function(next) {
  const tour = await this.model('Tour').findById(this.tour);
  const places = await this.model('Place').find({
    _id: { $in: this.places }
  });

  const placesTotalPrice = places.reduce((acc, place) => acc + place.price, 0);
  this.price = tour.price + placesTotalPrice;

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
