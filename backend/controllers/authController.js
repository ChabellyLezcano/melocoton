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

    // New user model
    const dbUser = new User({
      username,
      email,
      password,
      role,
      token: null, // Dejar el token como null inicialmente
    });

    // Hash password
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // Save user in db
    await dbUser.save();

    // Generate
    const token = await generateID();

    // Update user token
    dbUser.token = token;

    // Get random Image
    const image = randomImage();

    // Save user
    await dbUser.save();

    // Send confirmation account mail
    sendEmailConfirmation(dbUser.email, dbUser.token);

    // Response with data info
    res.json({
      ok: true,
      _id: dbUser.id,
      photo: image,
      email: dbUser.email,
      authenticated: dbUser.authenticated,
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
    const dbUser = await User.findOne({ email: email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El email no existe",
      });
    }

    // Check if the account is confirmed (authenticated is true)
    if (!dbUser.authenticated) {
      return res.status(401).json({
        ok: false,
        msg: "La cuenta no ha sido confirmadas. Por favor, verifique su correo electrónico",
      });
    }

    // Confirm if the password matches
    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      });
    }

    // Generate the JWT
    const token = await generateJWT(dbUser.id);

    // Update the token in the user
    dbUser.token = token;

    // Save the user with the updated token
    await dbUser.save();

    // Service response
    return res.json({
      ok: true,
      msg: "Inició de sesión correcto",
      _id: dbUser.id,
      email: dbUser.email,
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
  const { token } = req.params; // Get the token from the URL

  try {
    // Find a user in the database with the provided token.
    const user = await User.findOne({ token: token });

    // Verify if a user with the token was found.
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido. La cuenta no ha podido ser confirmada.",
      });
    }

    // Set the 'authenticated' field of the user to true to confirm the account.
    user.authenticated = true;

    // Set the token in the database to null.
    user.token = null;

    // Save the changes in the database.
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    // Render the confirmation view and send it to the client
    res.status(200).json({
      ok: true,
      msg: "Cuenta confirmada exitosamente",
    });
  } catch (error) {
    console.log(error);

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

    // Find user with email from req.body
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El user no existe con ese correo electrónico",
      });
    }

    // Check if the password has been used before
    if (newPassword === dbUser.password) {
      return res.status(400).json({
        ok: false,
        msg: "La nueva contraseña no puede ser igual a una contraseña ya utilizada anteriormente",
      });
    }

    // Generate new token
    const token = generateID(); // Reemplaza con tu propia lógica para generar tokens únicos y seguros.

    // Save token in the user account
    dbUser.token = token;
    await dbUser.save();

    // Send email to reset password
    await sendEmailResetPassword(email, token);

    // Render response to the client
    res.status(200).json({
      msg: "Se ha enviado un correo electrónico para restablecer la contraseña.",
      ok: true,
    });
  } catch (error) {
    console.error("Error en el controlador de forgotPassword:", error);
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
      return res.json({
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

module.exports = {
  createUser,
  loginUser,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
};
