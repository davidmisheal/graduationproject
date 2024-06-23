const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description1: { type: String, required: false },
  description2: { type: String, required: false },
  description3: { type: String, required: false },
  img: { type: String, required: false },
  images: [String],
  season: { type: String, required: true },
  safetyTips: { type: String, required: false },
  tourismType: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: false },
  favoriteCount: { type: Number, default: 0 }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
