const Place = require('../models/placeModel');

exports.getFavoriteCount = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).select('favoriteCount'); // Only fetch the favoriteCount
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json({ favoriteCount: place.favoriteCount });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching favorite count' });
  }
};

exports.createPlace = async (req, res) => {
  try {
    // Extract all possible attributes from the request body
    const {
      name,
      description1,
      description2,
      description3,
      img,
      images,
      season,
      safetyTips,
      tourismType,
      location,
      price
    } = req.body;

    // Create a new Place document with the provided attributes
    const place = new Place({
      name,
      description1,
      description2,
      description3,
      img,
      images,
      season,
      safetyTips,
      tourismType,
      location,
      price
    });

    // Save the new Place document in the database
    await place.save();

    // Send a successful response back with the newly created Place document
    res.status(201).json({
      status: 'success',
      data: {
        place
      }
    });
  } catch (error) {
    // Handle errors, such as validation errors or server issues
    res.status(400).json({
      status: 'error',
      message: 'Failed to create the place.',
      error: error.message
    });
  }
};

exports.getAllPlaces = async (req, res) => {
  try {
    console.log('Fetching all places from the database...');
    const places = await Place.find();
    console.log('Places fetched:', places);
    res.send(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).send(error);
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).send({ error: 'Place not found' });
    }
    res.send(place);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!place) {
      return res.status(404).send({ error: 'Place not found' });
    }
    res.send(place);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).send({ error: 'Place not found' });
    }
    res.send(place);
  } catch (error) {
    res.status(500).send(error);
  }
};
