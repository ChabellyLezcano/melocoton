const Reservation = require("../models/Reservation");
const { User } = require("../models/User");
const BoardGame = require("../models/Boardgame");
const {
  sendEmailNewReservation,
  sendEmailCancelReservation,
} = require("../helpers/email");

const { generateRandCodeReservation } = require("../helpers/generateRandCode");

const createReservation = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const userId = req.id;

    const user = await User.findById(userId);

    if (user.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no pueden crear reservas",
      });
    }

    // Verifica si el usuario ya tiene una reserva pendiente
    const existingPendingReservation = await Reservation.findOne({
      user: userId,
      game: gameId,
      status: "Pendiente de aceptación",
    });

    if (existingPendingReservation) {
      return res.status(400).json({
        ok: false,
        msg: "Ya tienes una reserva en proceso para este juego. No puedes crear otra en este momento.",
      });
    }

    const game = await BoardGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    if (game.status !== "Disponible") {
      return res.status(400).json({
        ok: false,
        msg: "El juego no está disponible para su reserva",
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
      user: userId,
      code, // Usa el código único
    });

    const reservation = await newReservation.save();

    // Enviar un correo de confirmación al usuario
    await sendEmailNewReservation(user.email, reservation, game, user.username);

    res.status(201).json({
      ok: true,
      msg: "Reservación creada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando reservación",
    });
  }
};
;

const getUserReservationHistory = async (req, res) => {
  try {
    const userId = req.id; // Suponiendo que la información del usuario está disponible en la solicitud

    // Utiliza populate para obtener los datos relacionados de Game y User
    const reservations = await Reservation.find({ user: userId })
      .populate('game');

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
      msg: "Reservaciones del usuario obtenidas",
      reservations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el historial de reservaciones del usuario",
    });
  }
};


const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);

    if (user.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no pueden anular reservaciones",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status === "Anulada" || reservation.status === "Recogido") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser cancelada en su estatus actual",
      });
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    reservation.status = "Anulada";

    await reservation.save();

    // Only if the reservation is valid should you attempt to get the game
    const game = await BoardGame.findById(reservation.game);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    // Send a confirmation email to the user
    await sendEmailCancelReservation(
      user.email,
      reservation,
      game,
      user.username
    );

    res.json({
      ok: true,
      msg: "Reservación cancelada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error cancelando reserva",
    });
  }
};

module.exports = {
  createReservation,
  getUserReservationHistory,
  cancelReservation,
};
