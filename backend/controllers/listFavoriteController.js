const FavoriteGame = require("../models/Favorite");
const BoardGame = require("../models/Boardgame");

// Marcar como favorito
const markAsFavorite = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.id;

    // Check if the game exists in the BoardGame database
    const gameExists = await BoardGame.findById(gameId);

    if (!gameExists) {
      return res
        .status(404)
        .json({ ok: false, msg: "El juego no existe en la base de datos" });
    }

    const existingFavorite = await FavoriteGame.findOne({
      user: userId,
      game: gameId,
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ ok: false, msg: "El juego ya está marcado como favorito" });
    }

    const favorite = new FavoriteGame({
      user: userId,
      game: gameId,
    });

    await favorite.save();

    res.status(201).json({ ok: true, msg: "Juego marcado como favorito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, msg: "Error marcando juego como favoritp" });
  }
};

// Desmarcar como favorito
const unmarkAsFavorite = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.id;

    const existingFavorite = await FavoriteGame.findOneAndDelete({
      user: userId,
      game: gameId,
    });

    if (!existingFavorite) {
      return res
        .status(404)
        .json({ ok: false, message: "El juego no está marcado como favorito" });
    }

    res.status(200).json({ ok: true, message: "Juego quitado de favoritos" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, msg: "Error quitando juego como favorito" });
  }
};

// Listar los juegos favoritos del usuario
const listFavorites = async (req, res) => {
  try {
    const userId = req.id;

    const favoriteGames = await FavoriteGame.find({ user: userId });

    const gameDetailsPromises = favoriteGames.map(async (favorite) => {
      const game = await BoardGame.findById(favorite.game);
      return {
        _id: favorite._id,
        game: game,
      };
    });

    const gameDetails = await Promise.all(gameDetailsPromises);

    res.status(200).json({
      ok: true,
      msg: "Listado de juetgos favoritos obtenido",
      gameDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error listando los juegos de mesa favoritos",
    });
  }
};

module.exports = {
  markAsFavorite,
  unmarkAsFavorite,
  listFavorites,
};
