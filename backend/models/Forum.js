const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      filename: String, // Nombre del archivo
      path: String,     // Ruta o URL del archivo
      // Otros campos relacionados a los archivos si es necesario
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema);
