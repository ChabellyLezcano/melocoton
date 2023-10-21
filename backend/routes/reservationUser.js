const express = require("express");
const router = express.Router();

const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const {
  createReservation,
  getUserReservationHistory,
  cancelReservation,
} = require("../controllers/reservationUserController");

// Middleware for JWT validation and field validation
router.use(validateJWT, validateFields);

// Route to create a new reservation
router.post("/add-reservation/:gameId", createReservation);

// Route to get the user's reservation history
router.get("/user/reservations", getUserReservationHistory);

// Route to cancel a reservation by its ID
router.post("/cancel-reservation/:reservationId", cancelReservation);

module.exports = router;
