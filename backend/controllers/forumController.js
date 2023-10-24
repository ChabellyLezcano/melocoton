const Message = require("../models/Forum"); // Asegúrate de que la ruta del modelo sea correcta

// Enviar mensajes
const createMessage = async (req, res) => {
  const { text, attachments } = req.body;
  const userId = req.id;
  const newMessage = new Message({
    text,
    user: userId,
    date: new Date(),
    attachments: attachments, // Asignar los archivos adjuntos al mensaje
  });

  try {
    const savedMessage = await newMessage.save();
    // Emitir el nuevo mensaje a todos los clientes conectados
    req.io.emit("newMessage", savedMessage);
    return res
      .status(201)
      .json({ ok: true, msg: "Mensaje enviado", savedMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error enviando el mensaje" });
  }
};

// Obtener listado de mensajes
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ date: -1 })
      .populate({
        path: "user",
        select: "username photo role", // Ajusta los campos que deseas mostrar del usuario
      })
      .exec();

    return res
      .status(200)
      .json({ ok: true, msg: "Lista de mensajes", messages });
  } catch (error) {
    return res.status(500).json({ error: "Error al capturar los mensajes" });
  }
};

// Delete message (by his user creator)
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.id; // Usuario actual obtenido a partir del token

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    // Verificar si el usuario actual es el creador del mensaje
    if (message.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "No estás autorizado para borrar el mensaje" });
    }

    await Message.findByIdAndRemove(messageId).exec();
    // Emitir un evento para borrar el mensaje a todos los clientes conectados
    req.io.emit("deleteMessage", messageId);
    return res.json({ ok: true, msg: "Mensaje eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error borrando el mensaje" });
  }
};

// Editar mensje por el usuario creador
const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body; // El nuevo texto del mensaje
  const userId = req.id; // Usuario actual obtenido a partir del token

  try {
    // Buscar el mensaje por su ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    // Verificar si el usuario actual es el creador del mensaje
    if (message.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "No estás autorizado a editar el mensaje" });
    }

    // Actualizar el texto del mensaje y los archivos adjuntos
    message.text = text;
    message.date = new Date(); // Actualizar la fecha del mensaje si es necesario
    message.attachments = req.body.attachments; // Actualizar los archivos adjuntos

    const updatedMessage = await message.save();

    // Emitir un evento para informar a los clientes sobre la edición del mensaje
    req.io.emit("editMessage", updatedMessage);

    return res.json({
      ok: true,
      msg: "Mensaje editado correctamente",
      updatedMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error editando el mensaje" });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage,
  editMessage,
};
