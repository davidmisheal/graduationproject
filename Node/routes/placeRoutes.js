const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/', placeController.getAllPlaces);
router.post('/', placeController.createPlace);
router.get('/:id', placeController.getPlaceById);
router.get('/:id/favorites', placeController.getFavoriteCount);
router.patch('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);

module.exports = router;
