const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  rating: Number,
  sentiment: String,
  aspects: [String],
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
