const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { tour, places, date, price } = req.body;

  if (!req.user) {
    return next(new AppError('Not authorized to access this resource', 401));
  }

  // Check if there's already a booking for the same tour on the same date
  const existingBooking = await Booking.findOne({ tour: tour, date: date });

  if (existingBooking) {
    return res.status(403).json({
      status: 'fail',
      message: 'Sorry, the tour is already booked on this date'
    });
  }

  const newBooking = await Booking.create({
    tour,
    user: req.user._id,
    places,
    date,
    price
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking
    }
  });
});

exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  await Booking.deleteOne({ _id: req.params.bookingId });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
// Fetch all bookings for a specific user
exports.getBookingsByUser = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.userId }).populate(
    'tour places'
  );
  if (!bookings) {
    return next(new AppError('No bookings found for this user', 404));
  }
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Fetch all bookings for a specific tour
exports.getBookingsByTour = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ tour: req.params.tourId }).populate(
    'user places'
  );
  if (!bookings) {
    return next(new AppError('No bookings found for this tour', 404));
  }
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});
