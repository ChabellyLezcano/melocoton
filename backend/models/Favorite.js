const mongoose = require("mongoose");

const favoriteGameSchema = new mongoose.Schema({
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
});

const FavoriteGame = mongoose.model("FavoriteGame", favoriteGameSchema);

module.exports = FavoriteGame;
