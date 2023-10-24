const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  photo: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true,  enum: [
    "Current",
    "Admin",
  ] },
  token: { type: String, default: null },
  authenticated: { type: Boolean, default: false },
  accountStatus: {  type: String,
    enum: [
      "Activo",
      "Bloqueado",
    ], default: "Activo" },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
