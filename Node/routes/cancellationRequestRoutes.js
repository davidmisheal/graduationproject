const express = require('express');
const cancellationRequestController = require('../controllers/cancellationRequestController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, cancellationRequestController.createCancellationRequest)
  .get(authController.protect, authController.restrictTo('admin'), cancellationRequestController.getAllCancellationRequests);

router
  .route('/:id')
  .patch(authController.protect, authController.restrictTo('admin'), cancellationRequestController.updateCancellationRequest);

module.exports = router;
