const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  deleteMessage,
  editMessage,
} = require("../controllers/forumController");
const { validateJWT } = require("../middlewares/validate-jwt");

// Middleware de validación JWT
router.use(validateJWT);

// Ruta para crear un nuevo mensaje
router.post(
  "/create-message",
  [
    check("text", "El texto del mensaje es obligatorio").not().isEmpty(),
  ],
  createMessage
);

// Ruta para listar todos los mensajes
router.get("/get-messages", getAllMessages);

// Ruta para eliminar un mensaje por ID
router.delete("/delete-message/:messageId", deleteMessage);

// Ruta para editar un mensaje por ID
router.put(
  "/edit-message/:messageId",
  [
    check("newText", "El nuevo texto del mensaje es obligatorio").not().isEmpty(),
  ],
  editMessage
);

module.exports = router;
