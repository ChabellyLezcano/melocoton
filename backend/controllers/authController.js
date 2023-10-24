const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const {
  sendEmailConfirmation,
  sendEmailResetPassword,
  sendWelcomeEmail,
} = require("../helpers/email.js");
const generateID = require("../helpers/generateId");
const { randomImage } = require("../helpers/randomImage");

// Registro
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Verify if the user exists
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });
    }

    // Verify unique username
    const userByUsername = await User.findOne({ username });

    if (userByUsername) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese nombre de usuario",
      });
    }
    // Get random Image
    const image = randomImage();

    // New user model
    const newUser = new User({
      photo: image,
      username,
      email,
      password,
      role,
      token: null, // Dejar el token como null inicialmente
    });

    // Hash password
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    // Generate
    const token = await generateID();

    // Update user token
    newUser.token = token;

    // Save user
    await newUser.save();

    // Send confirmation account mail
    sendEmailConfirmation(newUser.email, newUser.token);

    // Response with data info
    res.status(200).json({
      ok: true,
      _id: newUser._id,
      photo: image,
      email: newUser.email,
      authenticated: newUser.authenticated,
      token,
      role,
      msg: "El correo de confirmación de cuenta ha sido enviado. Revise su correo electrónico",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor, hable con el administrador",
    });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El email no existe",
      });
    }

    // Check if the account is confirmed (authenticated is true)
    if (!user.authenticated) {
      return res.status(401).json({
        ok: false,
        msg: "La cuenta no ha sido confirmada. Por favor, verifique su correo electrónico",
      });
    }

    // Check if the account is confirmed (authenticated is true)
    if (!user.accountStatus === "Bloqueado") {
      return res.status(401).json({
        ok: false,
        msg: "Su usuario se encuentra bloqueado",
      });
    }

    // Confirm if the password matches
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      });
    }

    // Generate the JWT
    const token = await generateJWT(user.id);

    // Update the token in the user
    user.token = token;

    // Save the user with the updated token
    await user.save();

    // Service response
    return res.status(200).json({
      ok: true,
      msg: "Inicio de sesión correcto",
      _id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      photo: user.photo,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

// Confirmar cuenta
const confirmAccount = async (req, res) => {
  const { token } = req.params; // Capturar el token de la url o header

  try {
    // Buscar un usuario en la base de dato que tenga el token capturado de la petición
    const user = await User.findOne({ token: token });

    // Verificar si no existe el usuario en la db
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido. La cuenta no ha podido ser confirmada.",
      });
    }

    // Establecer authenticated en true si se confirma correctamente la cuenta
    user.authenticated = true;

    // Poner el token a null
    user.token = null;

    // Guardar cambios en la db
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    // Enviar respuesta exitosa
    res.status(200).json({
      ok: true,
      msg: "Cuenta confirmada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al confirmar la cuenta. Contacte con el administrador",
    });
  }
};

//Olvidé contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar si existe un usuario con el email proporcionado
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese correo electrónico",
      });
    }

    // Comprobar si la contraseña ha sido utilizada anteriormente
    if (newPassword === user.password) {
      return res.status(400).json({
        ok: false,
        msg: "La nueva contraseña no puede ser igual a una contraseña ya utilizada anteriormente",
      });
    }

    // Generar un token para restablecerla
    const token = generateID();

    // Guardar el token en la db
    user.token = token;
    await user.save();

    // Enviar email para establecer contraeña
    await sendEmailResetPassword(email, token);

    // Enviar respuesta exitosa
    res.status(200).json({
      msg: "Se ha enviado un correo electrónico para restablecer la contraseña.",
      ok: true,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al procesar la solicitud." });
  }
};

// Restablecer contraseña
const newPassword = async (req, res) => {
  const { token } = req.params; // Obtener el token de req.params
  const { newPassword } = req.body; // Obtener las contraseñas del cuerpo de la solicitud

  try {
    // Verificar si el token existe
    if (!token) {
      return res.status(400).json({
        ok: false,
        msg: "Token no proporcionado en la solicitud",
      });
    }

    // Buscar un user en la base de datos que tenga el token proporcionado.
    const user = await User.findOne({ token: token });

    // Verificar si se encontró un user con el token.
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Token no válido",
      });
    }

    // Verificar que la nueva contraseña no sea igual a la antigua
    if (bcrypt.compareSync(newPassword, user.password)) {
      return res.status(400).json({
        ok: false,
        msg: "La nueva contraseña no puede ser igual a una contraseña anterior",
      });
    }

    // Actualizar la contraseña del user
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(newPassword, salt);

    // Poner el token en null
    user.token = null;

    // Guardar los cambios en la base de datos
    await user.save();

    // Respondemos con un mensaje de éxito
    return res.status(200).json({
      ok: true,
      msg: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar la contraseña",
    });
  }
};

// Verificar token
const checkToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Verificar si el token existe en la base de datos
    const user = await User.findOne({ token });

    if (user) {
      // Aquí puedes devolver la información del user
      return res.status(200).json({
        ok: true,
        user,
        msg: "Token confirmado",
      });
    } else {
      return res.status(401).json({
        ok: false,
        msg: "Token inválido",
      });
    }
  } catch (error) {
    // En caso de error, devuelve un error
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al validar el token",
    });
  }
};

const revalidateToken = async (req, res) => {
  try {
    const userId = req.id;

    // Generar el JWT
    const token = await generateJWT(userId);

    const user = await User.findById(userId);

    const response = {
      ok: true,
      _id: userId,
      token,
      role: user.role,
      email: user.email,
      username: user.username,
      photo: user.photo,
      msg: "Sesión renovada",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const errorResponse = {
      ok: false,
      msg: "Error al renovar la sesión. Contacte con el administrador",
    };

    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  createUser,
  loginUser,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
  revalidateToken,
};
