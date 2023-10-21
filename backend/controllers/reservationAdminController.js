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
        msg: "Only administrators are allowed to access reservation history",
      });
    }

    // Obtener todas las reservas
    const reservations = await Reservation.find().populate("user game");

    // Actualizar el estado de las reservas vencidas
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
      msg: "Error fetching admin reservation history",
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

    if (!adminUser) {
      return res.status(401).json({
        ok: false,
        msg: "Only administrators are allowed to accept reservations",
      });
    }

    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Only administrators are allowed to accept reservations",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservation not found",
      });
    }

    if (reservation.status !== "Pending acceptance") {
      return res.status(400).json({
        ok: false,
        msg: "Reservation cannot be accepted in its current status",
      });
    }

    // Verificar si ya existe una reserva "Accepted" para el mismo juego
    const existingAcceptedReservation = await Reservation.findOne({
      game: reservation.game,
      status: "Accepted",
    });

    if (existingAcceptedReservation) {
      return res.status(400).json({
        ok: false,
        msg: "Another reservation for this game has already been accepted",
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
        reservation.status = "Accepted";

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
          msg: "Reservation accepted successfully",
          reservation,
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: "Invalid date format for expirationDate",
        });
      }
    } else {
      res.status(400).json({
        ok: false,
        msg: "Invalid date format for expirationDate",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error accepting reservation",
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
        msg: "Only administrators are allowed to reject reservations",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservation not found",
      });
    }

    if (reservation.status !== "Pending acceptance"  && reservation.status !== "Accepted") {
      return res.status(400).json({
        ok: false,
        msg: "Reservation cannot be rejected in its current status",
      });
    }

    const game = await BoardGame.findById(reservation.game);

    reservation.status = "Rejected";
    reservation.rejectionReason = rejectionReason;

    // Obtener el email del usuario que realizó la reserva
    const userWhoReserved = await User.findById(reservation.user);
    const userEmail = userWhoReserved.email;
    const username = userWhoReserved.username;

    await reservation.save();

    await sendEmailReservationRejection(userEmail, reservation, game, username);

    res.json({
      ok: true,
      msg: "Reservation rejected successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error rejecting reservation",
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
        msg: "Only administrators are allowed to mark reservations as picked up",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservation not found",
      });
    }

    if (reservation.status !== "Accepted") {
      return res.status(400).json({
        ok: false,
        msg: "Reservation cannot be marked as picked up in its current status",
      });
    }

    reservation.status = "Picked up";
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
      msg: "Reservation marked as picked up successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error marking reservation as picked up",
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
        msg: "Only administrators are allowed to mark reservations as completed",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservation not found",
      });
    }

    if (reservation.status !== "Picked up") {
      return res.status(400).json({
        ok: false,
        msg: "Reservation cannot be marked as completed in its current status",
      });
    }

    const game = await BoardGame.findById(reservation.game);

    if (game) {
      game.status = "Disponible";
      await game.save();
    }

    reservation.status = "Completed";
    reservation.endDate = new Date(); // Agregar la fecha actual como fecha de entrega
    await reservation.save();

    // Obtener el email del usuario que realizó la reserva
    const userWhoReserved = await User.findById(reservation.user);
    const userEmail = userWhoReserved.email;
    const username = userWhoReserved.username;

    await sendEmailReservationCompleted(userEmail, reservation, game, username);

    res.json({
      ok: true,
      msg: "Reservation marked as completed successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error marking reservation as completed",
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
      msg: "Error fetching reservations by status",
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
