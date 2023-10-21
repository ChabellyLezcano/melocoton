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
router.post("/reservations/accept/:reservationId", acceptReservation);

// Reject a reservation (reservationId is passed in the URL)
router.post("/reservations/reject/:reservationId", rejectReservation);

// Mark a reservation as completed (reservationId is passed in the URL)
router.post("/reservations/mark-as-completed/:reservationId", markAsCompleted);

// Mark a reservation as picked up by the user (reservationId is passed in the URL)
router.post("/reservations/mark-as-picked-up/:reservationId", markAsPickedUp);


module.exports = router;
