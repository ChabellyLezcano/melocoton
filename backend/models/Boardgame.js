const mongoose = require("mongoose");
const { generateRandCode } = require("../helpers/generateRandCode");

const boardGameSchema = new mongoose.Schema({
  photo: String, // URL de la imagen del juego de mesa
  title:  { type: String, required: true },
  description: { type: String },
  objective:  { type: String },
  rules: { type: String},
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