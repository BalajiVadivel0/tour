const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    lat: Number,
    lng: Number
  },
  images: [String]
});

module.exports = mongoose.model("Place", placeSchema);
