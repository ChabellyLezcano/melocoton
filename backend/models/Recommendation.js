const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // Asegura que solo puede haber una recomendación por usuario
    required: true,
  },
  recommendedGameIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoardGame",
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
