const {
  sendChangeToAdminEmail,
  sendChangeToCurrentEmail,
  sendAccountStatusBlockedEmail,
  sendAccountStatusActiveEmail,
} = require("../helpers/email");
const { User } = require("../models/User");

const listUsers = async (req, res) => {
  try {
    const users = await User.find(); // Encuentra todos los usuarios en la base de datos
    res.json({ ok: true, users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al listar usuarios" });
  }
};

const changeToAdmin = async (req, res) => {
  try {
    const userId = req.id; // Captura el ID de usuario desde los parámetros de la ruta
    const user = await User.findById(userId);
    const requestingUser = req.params.userId; // Obtén el usuario que realiza la solicitud

    // Verifica si el usuario que realiza la solicitud es el mismo usuario autenticado
    if (userId === requestingUser) {
      return res
        .status(403)
        .json({ ok: false, msg: "No puedes cambiar tu propio rol" });
    }

    const userWhoChange = await User.findById(requestingUser);

    if (!userWhoChange) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verifica si el usuario que realiza la solicitud es "Admin"
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ ok: false, msg: "No tienes permiso para cambiar el rol" });
    }

    // Cambia el rol de "Current" a "Admin" para el usuario de destino
    if (userWhoChange.role === "Current") {
      userWhoChange.role = "Admin";
      await userWhoChange.save();
      sendChangeToAdminEmail(userWhoChange.email, userWhoChange.username);
      return res.json({ ok: true, msg: "Rol cambiado a Admin" });
    }

    return res
      .status(403)
      .json({ ok: false, msg: "No tienes permiso para cambiar el rol" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al cambiar el rol a Admin" });
  }
};

const changeToCurrent = async (req, res) => {
  try {
    const userId = req.id; // Captura el ID de usuario desde los parámetros de la ruta
    const user = await User.findById(userId);
    const requestingUser = req.params.userId; // Obtén el usuario que realiza la solicitud

    // Verifica si el usuario que realiza la solicitud es el mismo usuario autenticado
    if (userId === requestingUser) {
      return res
        .status(403)
        .json({ ok: false, msg: "No puedes cambiar tu propio rol" });
    }

    const userWhoChange = await User.findById(requestingUser);

    if (!userWhoChange) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verifica si el usuario que realiza la solicitud es "Admin"
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ ok: false, msg: "No tienes permiso para cambiar el rol" });
    }

    // Cambia el rol de "Admin" a "Current" para el usuario de destino
    if (userWhoChange.role === "Admin") {
      userWhoChange.role = "Current";
      await userWhoChange.save();
      sendChangeToCurrentEmail(userWhoChange.email, userWhoChange.username);
      return res.json({ ok: true, msg: "Rol cambiado a Current" });
    }

    return res
      .status(403)
      .json({ ok: false, msg: "No tienes permiso para cambiar el rol" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al cambiar el rol a Admin" });
  }
};

const changeAccountStatusToBlocked = async (req, res) => {
  try {
    const userId = req.id; // Captura el ID de usuario desde los parámetros de la ruta
    const user = await User.findById(userId);
    const requestingUser = req.params.userId; // Obtén el usuario que realiza la solicitud

    // Verifica si el usuario que realiza la solicitud es el mismo usuario autenticado
    if (userId === requestingUser) {
      return res
        .status(403)
        .json({ ok: false, msg: "No puedes bloquear tu propia cuenta" });
    }

    const userWhoChange = await User.findById(requestingUser);

    if (!userWhoChange) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verifica si el usuario que realiza la solicitud es "Admin"
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({
          ok: false,
          msg: "No tienes permiso para cambiar el estado de la cuenta",
        });
    }

    // Cambia el estado de la cuenta a "Blocked" para el usuario de destino
    if (userWhoChange.accountStatus === "Activo") {
      userWhoChange.accountStatus = "Bloqueado";
      await userWhoChange.save();
      sendAccountStatusBlockedEmail(
        userWhoChange.email,
        userWhoChange.username
      );
      return res.json({ ok: true, msg: "Usuario bloqueado" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, msg: "Error al cambiar el estado de la cuenta" });
  }
};

const changeAccountStatusToActive = async (req, res) => {
  try {
    const userId = req.id; // Captura el ID de usuario desde los parámetros de la ruta
    const user = await User.findById(userId);
    const requestingUser = req.params.userId; // Obtén el usuario que realiza la solicitud

    // Verifica si el usuario que realiza la solicitud es el mismo usuario autenticado
    if (userId === requestingUser) {
      return res
        .status(403)
        .json({ ok: false, msg: "No puedes desbloquear tu propia cuenta" });
    }

    const userWhoChange = await User.findById(requestingUser);

    if (!userWhoChange) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verifica si el usuario que realiza la solicitud es "Admin"
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({
          ok: false,
          msg: "No tienes permiso para cambiar el estado de la cuenta",
        });
    }

    // Cambia el estado de la cuenta a "Active" para el usuario de destino
    if (userWhoChange.accountStatus === "Bloqueado") {
      userWhoChange.accountStatus = "Activo";
      await userWhoChange.save();
      sendAccountStatusActiveEmail(userWhoChange.email, userWhoChange.username);
      return res.json({ ok: true, msg: "Usuario desbloqueado" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, msg: "Error al cambiar el estado de la cuenta" });
  }
};

module.exports = {
  listUsers,
  changeAccountStatusToActive,
  changeAccountStatusToBlocked,
  changeToAdmin,
  changeToCurrent,
};
