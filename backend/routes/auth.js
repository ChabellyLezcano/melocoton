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
  userIsAdmin,
  userInfo,
} = require("../controllers/authController");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

// Registro del usuario
router.post(
  "/register",
  validateFields,
  createUser
);

// Login
router.post(
  "/",
  [
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  validateFields,
  loginUser
);

// Confirmar cuenta
router.get("/confirm-account/:token", confirmAccount);

// Olvidé paswword
router.post(
  "/forgot-password",
  [check("email", "Please enter a valid email address").isEmail()],
  validateFields,
  forgotPassword
);

// Restablecer token
router.post(
  "/reset-password/:token",
  [
    check(
      "newPassword",
      "New password must be at least 6 characters long"
    ).isLength({ min: 6 }),
  ],
  validateFields,
  newPassword
);

// Verificar Token
router.get("/check-token/:token", checkToken);

// Validar y revalidar token
router.get("/renew", validateJWT, revalidateToken);

router.get('/user-is-admin', validateJWT, userIsAdmin);


router.get('/user-info', validateJWT, userInfo);


module.exports = router;
