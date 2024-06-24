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
exports.deleteBooking = factory.deleteOne(Booking);

exports.getBookingDetails = catchAsync(async (req, res, next) => {
  const userId = req.user._id; // Assuming the user ID is stored in req.user after authentication

  const booking = await Booking.findById(req.params.bookingId)
    .populate({
      path: 'tour',
      select: 'name'
    })
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'places',
      select: 'name description'
    });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check the role of the logged-in user and tailor the response accordingly
  if (req.user.role === 'user') {
    res.status(200).json({
      status: 'success',
      data: {
        booking: {
          tourName: booking.tour.name,
          places: booking.places,
          price: booking.price,
          date: booking.date,
          status: booking.status
        }
      }
    });
  } else {
    res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to view this data'
    });
  }
});

exports.getGuideBookingDetails = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId).populate({
    path: 'tour',
    match: { guides: req.user._id } // Ensures the tour includes this guide
  });

  if (!booking || !booking.tour) {
    return next(
      new AppError(
        'No booking found or you are not authorized to view this booking',
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});
