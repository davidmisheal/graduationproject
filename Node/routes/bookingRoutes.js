const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.get('/tour/:tourId', bookingController.getBookingsByTour);
router.patch('/:bookingId/accept', bookingController.acceptBooking);
router.patch('/:bookingId/decline', bookingController.declineBooking);
router.patch('/:bookingId/finish', bookingController.finishedBooking);

router
  .route('/:bookingId')
  .patch(authController.protect, bookingController.updateBooking);
router.use(authController.protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:bookingId')
  .delete(bookingController.deleteBooking);

router.get('/user/:userId', bookingController.getBookingsByUser);

module.exports = router;