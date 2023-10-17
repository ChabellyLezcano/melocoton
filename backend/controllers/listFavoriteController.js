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
        .json({ message: "The game does not exist in the database" });
    }

    const existingFavorite = await FavoriteGame.findOne({
      user: userId,
      game: gameId,
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "The game is already marked as a favorite" });
    }

    const favorite = new FavoriteGame({
      user: userId,
      game: gameId,
    });

    await favorite.save();

    res.status(201).json({ message: "Game marked as a favorite" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
        .json({ message: "The game is not marked as a favorite" });
    }

    res.status(200).json({ message: "Game unmarked as a favorite" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json(gameDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  markAsFavorite,
  unmarkAsFavorite,
  listFavorites,
};