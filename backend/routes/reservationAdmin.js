const express = require("express");
const router = express.Router();
const {
  getAdminReservationHistory,
  acceptReservation,
  rejectReservation,
  markAsCompleted,
  markAsPickedUp,
  getPendingReservations,
} = require("../controllers/reservationAdminController");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// Middleware to validate JWT and fields
router.use(validateJWT, validateFields);

// Routes for administrators

// Get all reservations
router.get("/admin/reservations", getAdminReservationHistory);

// Accept a reservation (reservationId is passed in the URL)
router.post("/admin/reservations/accept/:reservationId", acceptReservation);

// Reject a reservation (reservationId is passed in the URL)
router.post("/admin/reservations/reject/:reservationId", rejectReservation);

// Mark a reservation as completed (reservationId is passed in the URL)
router.post("/admin/reservations/mark-as-completed/:reservationId", markAsCompleted);

// Mark a reservation as picked up by the user (reservationId is passed in the URL)
router.post("/admin/reservations/mark-as-picked-up/:reservationId", markAsPickedUp);

// Get pending reservations for acceptance (admins only)
router.get("/admin/reservations/pending", getPendingReservations);

module.exports = router;
