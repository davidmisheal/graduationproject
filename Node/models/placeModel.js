const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  placeId: { type: Number, required: true },
  name: { type: String, required: true },
  description1: { type: String, required: false },
  description2: { type: String, required: false },
  description3: { type: String, required: false },
  img: { type: String, required: true },
  tourismType:{type:String,required:true},
  location: { type: String, required: true },
  price:{type: Number ,required :false}
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
