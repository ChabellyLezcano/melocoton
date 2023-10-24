const Reservation = require("../models/Reservation");
const { User } = require("../models/User");
const BoardGame = require("../models/Boardgame");
const {
  sendEmailReservationConfirmation,
  sendEmailReservationRejection,
  sendEmailReservationCompleted,
  sendEmailReservationPickedUp,
} = require("../helpers/email");

// Obtener el historial de las reservaciones por el admin
const getAdminReservationHistory = async (req, res) => {
  try {
    // Obtener el ID de usuario del administrador desde la solicitud
    const adminUserId = req.id;

    // Buscar al usuario por su ID
    const adminUser = await User.findById(adminUserId);

    // Verificar si el usuario es un administrador
    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores tienen acceso al historial de reservas",
      });
    }

    // Obtener todas las reservas
    const reservations = await Reservation.find().populate("user game");

    // Actualizar el estado de las reservas vencidas
    for (const reservation of reservations) {
      if (
        reservation.status === "Aceptada" &&
        reservation.expirationDate < new Date()
      ) {
        reservation.status = "Expirada";
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
      msg: "Error capturando las reservas",
    });
  }
};

// Aceptar reservas
const acceptReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const adminUserId = req.id;
    const { expirationDate } = req.body;

    const adminUser = await User.findById(adminUserId);

    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores estan autorizados a aceptar reservas",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status !== "Pendiente de aceptación") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser aceptada en su estatus actual",
      });
    }

    // Verificar si ya existe una reserva "Aceptada" para el mismo juego
    const existingAceptedReservation = await Reservation.findOne({
      game: reservation.game,
      status: "Aceptada",
    });

    if (existingAceptedReservation) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una reservación aceptada para este juego",
      });
    }

    const dateParts = expirationDate.split("/");
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedExpirationDate = new Date(year, month - 1, day);
        reservation.expirationDate = parsedExpirationDate;
        reservation.status = "Aceptada";

        const userWhoReserved = await User.findById(reservation.user);
        const userEmail = userWhoReserved.email;
        const username = userWhoReserved.username;

        await reservation.save();

        const game = await BoardGame.findById(reservation.game);

        if (game) {
          game.status = "No Disponible";
          await game.save();
        }

        await sendEmailReservationConfirmation(
          userEmail,
          reservation,
          game,
          username
        );

        res.json({
          ok: true,
          msg: "Reservación aceptada correctamente",
          reservation,
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: "Formato de fecha invalido",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error aceptando la reservación",
    });
  }
};

// Rechazar reserva
const rejectReservation = async (req, res) => {
  try {
    const { reservationId } = req.params; // Obtener el reservationId de req.params
    const { rejectionReason } = req.body;
    const adminUserId = req.id; // ID del administrador que rechaza la reserva

    // Buscar al usuario administrador por su id
    const adminUser = await User.findById(adminUserId);

    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores pueden rechazar reservaciones",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (
      reservation.status !== "Pendiente de aceptación" &&
      reservation.status !== "Aceptada"
    ) {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser rechazada en su estatus actual",
      });
    }

    const game = await BoardGame.findById(reservation.game);

    reservation.status = "Rechazada";
    reservation.rejectionReason = rejectionReason;

    // Obtener el email del usuario que realizó la reserva
    const userWhoReserved = await User.findById(reservation.user);
    const userEmail = userWhoReserved.email;
    const username = userWhoReserved.username;

    await reservation.save();

    await sendEmailReservationRejection(userEmail, reservation, game, username);

    res.json({
      ok: true,
      msg: "Reservación rechazada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error rechazando la reservación",
    });
  }
};

// Marcar el juego como recogido
const markAsPickedUp = async (req, res) => {
  try {
    const { reservationId } = req.params; // Obtener el reservationId de req.params
    const adminUserId = req.id; // ID del administrador que marca la reserva como recogida

    // Buscar al usuario administrador por su id
    const adminUser = await User.findById(adminUserId);

    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores pueden marcar como recogida una reservación",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status !== "Aceptada") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser marcada como recogida",
      });
    }

    reservation.status = "Recogido";
    const game = await BoardGame.findById(reservation.game);

    // Obtener el email del usuario que realizó la reserva
    const userWhoReserved = await User.findById(reservation.user);
    const userEmail = userWhoReserved.email;
    const username = userWhoReserved.username;

    reservation.takenDate = new Date();
    await reservation.save();

    await sendEmailReservationPickedUp(userEmail, reservation, game, username);

    res.json({
      ok: true,
      msg: "Reservación marcada como recogida correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error marcando reservación como recogida",
    });
  }
};

// Marcar el juego como entregado
const markAsCompleted = async (req, res) => {
  try {
    const { reservationId } = req.params; // Obtener el reservationId de req.params
    const adminUserId = req.id; // ID del administrador que marca la reserva como completada

    // Buscar al usuario administrador por su id
    const adminUser = await User.findById(adminUserId);

    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores pueden marcar una reserva como completada",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status !== "Recogido") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser marcada como recogida en su estatus actual",
      });
    }

    const game = await BoardGame.findById(reservation.game);

    if (game) {
      game.status = "Disponible";
      await game.save();
    }

    reservation.status = "Completada";
    reservation.endDate = new Date(); // Agregar la fecha actual como fecha de entrega
    await reservation.save();

    // Obtener el email del usuario que realizó la reserva
    const userWhoReserved = await User.findById(reservation.user);
    const userEmail = userWhoReserved.email;
    const username = userWhoReserved.username;

    await sendEmailReservationCompleted(userEmail, reservation, game, username);

    res.json({
      ok: true,
      msg: "Reservación marcada como completada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error marcando reservación como completada",
    });
  }
};

// Obtener reservaciones por estado
const getReservationsByStatus = async (req, res) => {
  try {
    // Obtener el estado de reserva deseado desde la solicitud
    const { status } = req.params;

    // Obtener todas las reservas con el estado especificado
    const reservations = await Reservation.find({ status: status }).populate(
      "user game"
    );

    res.json({
      ok: true,
      reservations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error capturando las reservaciones",
    });
  }
};

module.exports = {
  getAdminReservationHistory,
  acceptReservation,
  rejectReservation,
  markAsCompleted,
  markAsPickedUp,
  getReservationsByStatus,
};
