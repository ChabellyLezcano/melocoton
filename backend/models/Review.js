const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoardGame",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Puedes ajustar los límites según sea necesario
    max: 5,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
