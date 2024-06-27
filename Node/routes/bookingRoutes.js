const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.get('/tour/:tourId', bookingController.getBookingsByTour);
router.patch('/:bookingId/accept', bookingController.acceptBooking);
router.patch('/:bookingId/decline', bookingController.declineBooking);

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

module.exports = router;