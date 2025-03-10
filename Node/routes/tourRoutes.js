const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();
// router.param('id', tourController.checkID);

router.post(
  '/signup',
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.signupTour
);

// Route to fetch pending tours that haven't been approved yet
router.get(
  '/pending-tours',
  authController.protect,
  authController.restrictTo('admin'),
  tourController.getPendingTours
);

// Route to approve a tour
router.patch(
  '/approve-tour/:id',
  authController.protect,
  authController.restrictTo('admin'),
  tourController.approveTour
);

router.post('/login', tourController.loginTour);
router.get('/logout', tourController.logoutTour);
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
