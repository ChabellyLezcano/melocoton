const Review = require("../models/Review");
const { User } = require("../models/User");
const Reservation = require("../models/Reservation");
const BoardGame = require("../models/Boardgame");

// Crear una nueva reseña
const createReview = async (req, res) => {
  try {
    const { title, description, rating } = req.body;
    const user = req.id; // Usuario actual
    const { gameId } = req.params;

    // Buscar al usuario por su ID
    const dbUser = await User.findById(user);

    if (dbUser.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no pueden añadir reseñas",
      });
    }

    const game = await BoardGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    // Verificar si el usuario tiene una reserva del juego en estado "Completed"
    const completedReservation = await Reservation.findOne({
      user: user,
      game: gameId,
      status: "Completed",
    });

    if (!completedReservation) {
      return res.status(401).json({
        ok: false,
        msg: "Solo puedes añadir una reseña si esta se ha completado",
      });
    }

    // Verificar si el usuario ya ha revisado este juego
    const existingReview = await Review.findOne({ user, game: gameId });
    if (existingReview) {
      return res.status(400).json({
        ok: false,
        msg: "Ya has reseñado este juego",
      });
    }

    const newReview = new Review({
      title,
      description,
      user,
      game: gameId,
      rating,
    });

    const review = await newReview.save();

    res.status(201).json({
      ok: true,
      msg: "Reseña realizada correctamente",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error añadiendo review",
    });
  }
};

// Editar una reseña existente
const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { title, description, rating } = req.body;
    const user = req.id; // Usuario actual

    // Buscar al usuario por su id
    const dbUser = await User.findById(user);

    if (dbUser.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no están autorizados a editar reseñas",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada",
      });
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado a editar esta reseña",
      });
    }

    review.title = title;
    review.description = description;
    review.rating = rating;

    await review.save();

    res.json({
      ok: true,
      msg: "Reseña editada correctamente",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error editando reseña",
    });
  }
};

// Eliminar una reseña existente
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.id; // Usuario actual

    // Buscar al usuario por su id
    const dbUser = await User.findById(user);

    if (dbUser.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no están autorizados a eliminar reseñas",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada",
      });
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado a borrar esta reseña",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      ok: true,
      msg: "Reseña borrada satisfactoriamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando review",
    });
  }
};

// Obtener todas las reseñas de un juego específico
const getGameReviews = async (req, res) => {
  try {
    const { gameId } = req.params;
    const reviews = await Review.find({ game: gameId });

    res.json({
      ok: true,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error capturando las reseñas",
    });
  }
};

// Obtener todas las reseñas de un usuario específico
const getUserReviews = async (req, res) => {
  try {
    const userId = req.id; // Usuario actual
    const reviews = await Review.find({ user: userId });

    res.json({
      ok: true,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error capturando las reseñas del usuario",
    });
  }
};

// Obtner calificación media de reseñas
const getAverageRatingForGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await BoardGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    const reviews = await Review.find({ game: gameId });

    if (reviews.length === 0) {
      res.json({
        ok: true,
        averageRating: 0, // No hay reseñas para el juego, la calificación media es 0.
      });
    } else {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;

      res.json({
        ok: true,
        averageRating,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error campurando la media de reseñas",
    });
  }
};

module.exports = {
  createReview,
  editReview,
  deleteReview,
  getGameReviews,
  getUserReviews,
  getAverageRatingForGame,
};
