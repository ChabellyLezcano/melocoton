const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoardGame",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
  expirationDate: Date,
  deliveredDate: Date,
  takenDate: Date,
  status: {
    type: String,
    enum: [
      "Pending acceptance",
      "Accepted",
      "Rejected",
      "Canceled",
      "Picked up",
      "Expired",
      "Completed",
    ],
    default: "Pending acceptance",

  },
  rejectionReason: String,
  code: {
    type: String,
    unique: true, // Ensure that each game has a unique code
    required: true, // Make the code field required
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
