const mongoose = require("mongoose");

const boardGameSchema = new mongoose.Schema({
  photo: { type: String }, // URL de la imagen del juego de mesa
  title:  { type: String, required: true },
  description: { type: String, required: true },
  objective:  { type: String },
  rules: { type: String, default:""},
  status: {
    type: String,
    enum: ["Disponible", "No disponible"],
    default: "Disponible",
  },
  tags: [String],
  gallery_images: [{
    label: String,
    path: String,
  },],
  code: {
    type: String,
    unique: true, // Ensure that each game has a unique code
  },
});



module.exports = mongoose.model("BoardGame", boardGameSchema);