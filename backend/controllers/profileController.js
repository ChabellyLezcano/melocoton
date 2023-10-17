const { User } = require("../models/User");


// Obtner la información del perfil del usuario
const getUserInfo = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado desde el token u otra fuente
    const userId = req.id;

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Filtrar la información que el usuario puede ver
    const userInfo = {
      username: user.username,
      email: user.email,
      role: user.role,
      photo: user.photo, // También puedes incluir la foto si lo deseas
    };

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener la información del usuario" });
  }
};


// Actualizar foto de perfil
const updatePhoto = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado desde el token u otra fuente
    const userId = req.id;

    // Obtener la foto enviada en la solicitud
    const photo = req.file && req.file.filename; // Multer almacena el nombre del archivo en req.file.filename

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar la foto de perfil si se proporcionó
    if (photo) {
      user.photo = photo;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con un mensaje de éxito
    res.json({ message: "Foto de perfil actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la foto de perfil del usuario" });
  }
};


// Actualizar nombre de usuario
const updateUsername = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado desde el token u otra fuente
    const userId = req.id;

    // Obtener el nuevo nombre de usuario enviado en la solicitud
    const { username } = req.body;

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario está intentando cambiar a un nombre de usuario que ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Actualizar el nombre de usuario si se proporcionó
    if (username) {
      user.username = username;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con un mensaje de éxito
    res.json({ message: "Nombre de usuario actualizado con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al actualizar el nombre de usuario del usuario",
      });
  }
};


module.exports = {
  getUserInfo,
  updatePhoto,
  updateUsername,
};
