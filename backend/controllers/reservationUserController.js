const Reservation = require("../models/Reservation");
const { User } = require("../models/User");
const BoardGame = require("../models/Boardgame");
const {
  sendEmailNewReservation,
  sendEmailCancelReservation,
} = require("../helpers/email");

const {generateRandCodeReservation} = require("../helpers/generateRandCode")

const createReservation = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const user = req.id;

    const dbUser = await User.findById(user);

    if (dbUser.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Administrators are not allowed to create reservations",
      });
    }

    const game = await BoardGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Game not found",
      });
    }

    if (game.status !== "Disponible") {
      return res.status(400).json({
        ok: false,
        msg: "The game is not available for reservation",
      });
    }

    let code;
    let isCodeUnique = false;

    // Genera códigos hasta que encuentres uno único
    while (!isCodeUnique) {
      code = generateRandCodeReservation();
      // Consulta la base de datos para verificar si el código ya existe
      const existingReservation = await Reservation.findOne({ code });
      if (!existingReservation) {
        isCodeUnique = true;
      }
    }

    const newReservation = new Reservation({
      game: gameId,
      user,
      code, // Usa el código único
    });

    const reservation = await newReservation.save();

    // Enviar un correo de confirmación al usuario
    await sendEmailNewReservation(dbUser.email, reservation, game, dbUser.username);

    res.status(201).json({
      ok: true,
      msg: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creating reservation",
    });
  }
};

const getUserReservationHistory = async (req, res) => {
  try {
    const userId = req.id; // Assuming user information is available in the request
    const reservations = await Reservation.find({ user: userId });

    console.log(reservations)

    // Actualizar el estado de las reservas "Accepted" con fecha de vencimiento pasada
    for (const reservation of reservations) {
      if (
        reservation.status === "Accepted" &&
        reservation.expirationDate < new Date()
      ) {
        reservation.status = "Expired";
        await reservation.save();
      }
    }

    res.json({
      ok: true,
      reservations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error fetching user reservation history",
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params; // Corrige cómo obtienes reservationId
    const user = req.id; // Assuming user information is available in the request

    const dbUser = await User.findById(user);

    if (dbUser.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Administrators are not allowed to create reservations",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    const game = await BoardGame.findById(reservation.game);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Game not found",
      });
    }

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservation not found",
      });
    }

    if (
      reservation.status === "Canceled" ||
      reservation.status === "Picked up"
    ) {
      return res.status(400).json({
        ok: false,
        msg: "Reservation cannot be canceled in its current status",
      });
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "User not authenticated or missing user ID",
      });
    }

    reservation.status = "Canceled";

    await reservation.save();

    // Enviar un correo de confirmación al usuario
    await sendEmailCancelReservation(dbUser.email, reservation, game, dbUser.username);

    res.json({
      ok: true,
      msg: "Reservation canceled successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error canceling reservation",
    });
  }
};

module.exports = {
  createReservation,
  getUserReservationHistory,
  cancelReservation,
};
