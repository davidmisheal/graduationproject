const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:bookingId')
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.get('/user/:userId', bookingController.getBookingsByUser);
router.get('/tour/:tourId', bookingController.getBookingsByTour);

module.exports = router;
