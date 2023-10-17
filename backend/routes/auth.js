const { Router } = require("express");
const { check } = require("express-validator");
const {
  createUser,
  loginUser,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
} = require("../controllers/authController");

const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

// Route to create a new user
router.post(
  "/registro",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
    check("role", "Role is required").not().isEmpty(),
  ],
  validateFields,
  createUser
);

// Route for user login
router.post(
  "/",
  [
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  validateFields,
  loginUser
);

// Route to confirm the account
router.get("/confirm-account/:token", confirmAccount);

// Route to recover the account
router.post(
  "/forgot-password",
  [
    check("email", "Please enter a valid email address").isEmail(),
  ],
  validateFields,
  forgotPassword
);

// Route to confirm a token
router.get("/check-token/:token", checkToken);

// Route to set a new password
router.post(
  "/reset-password/:token",
  [
    check("newPassword", "New password must be at least 6 characters long").isLength({ min: 6 }),
  ],
  validateFields,
  newPassword
);

module.exports = router;
