const { Router } = require("express");
const { check } = require("express-validator");
const {
  createUser,
  loginUser,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
  revalidateToken,
} = require("../controllers/authController");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

// Registro del usuario
router.post("/register", validateFields, createUser);

// Login
router.post(
  "/",
  [
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "Introduzca un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({
      min: 8,
    }),
  ],
  validateFields,
  loginUser
);

// Confirmar cuenta
router.get("/confirm-account/:token", confirmAccount);

// Olvidé paswword
router.post(
  "/forgot-password",
  [
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "Introduzca un email válido").isEmail()
  ],
  validateFields,
  forgotPassword
);

// Restablecer password
router.post(
  "/reset-password/:token",
  [
    check("newPassword", "La contraseña es obligatoria").not().isEmpty(),
    check(
      "newPassword",
      "La contraseña debe tener mínimo 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  validateFields,
  newPassword
);

// Verificar Token
router.get("/check-token/:token", checkToken);

// Validar y revalidar token
router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
