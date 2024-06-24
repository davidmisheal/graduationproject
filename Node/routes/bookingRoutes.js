const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route('/:bookingId').get(bookingController.getBookingDetails);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.get(
  '/guide-bookings/:bookingId',
  authController.protect,
  bookingController.getGuideBookingDetails
);

module.exports = router;
