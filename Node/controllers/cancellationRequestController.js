const CancellationRequest = require('../models/cancellationRequestModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createCancellationRequest = catchAsync(async (req, res, next) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  const newRequest = await CancellationRequest.create({
    booking: bookingId,
    user: req.user.id,
    reason
  });

  res.status(201).json({
    status: 'success',
    data: {
      request: newRequest
    }
  });
});

exports.getAllCancellationRequests = catchAsync(async (req, res, next) => {
  const requests = await CancellationRequest.find().populate('booking user');

  res.status(200).json({
    status: 'success',
    data: {
      requests
    }
  });
});

exports.updateCancellationRequest = catchAsync(async (req, res, next) => {
    const cancellationRequest = await CancellationRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );
  
    if (!cancellationRequest) {
      return next(new AppError('No cancellation request found with that ID', 404));
    }
  
    if (req.body.status === 'approved') {
      const booking = await Booking.findByIdAndUpdate(
        cancellationRequest.booking,
        { status: 'declined' },
        {
          new: true,
          runValidators: true
        }
      );
  
      if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
      }
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        cancellationRequest
      }
    });
  });
