const express = require("express");
const router = express.Router();
const {
  getAdminReservationHistory,
  acceptReservation,
  rejectReservation,
  markAsCompleted,
  markAsPickedUp,
  getReservationsByStatus,
} = require("../controllers/reservationAdminController");
const { validateJWT } = require("../middlewares/validate-jwt");

// Middleware to validate JWT and fields
router.use(validateJWT);

// Routes for administrators

// Get all reservations
router.get("/reservations", getAdminReservationHistory);

// Get all reservations
router.get("/reservations-by-status/:status", getReservationsByStatus);

// Accept a reservation (reservationId is passed in the URL)
router.post("/accept-reservation/:reservationId", acceptReservation);

// Reject a reservation (reservationId is passed in the URL)
router.post("/reject-reservation/:reservationId", rejectReservation);

// Mark a reservation as completed (reservationId is passed in the URL)
router.post("/mark-as-completed-reservation/:reservationId", markAsCompleted);

// Mark a reservation as picked up by the user (reservationId is passed in the URL)
router.post("/mark-as-picked-up-reservation/:reservationId", markAsPickedUp);


module.exports = router;
