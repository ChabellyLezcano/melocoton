const express = require("express");
const {
  listUsers,
  changeToAdmin,
  changeToCurrent,
  changeAccountStatusToBlocked,
  changeAccountStatusToActive,
} = require("../controllers/userController");
const { validateJWT } = require("../middlewares/validate-jwt");
const router = express.Router();

// Middleware for JWT validation and field validation
router.use(validateJWT);

// Obtener usuarios
router.get("/list-users", listUsers);

// Cambiar role de usuario de current a admin
router.post("/change-to-admin/:userId", changeToAdmin);

// Cambiar role de usuario de admin a current
router.post("/change-to-current/:userId", changeToCurrent);

// Cambiar status de cuenta de activo a bloqueado
router.post(
  "/change-account-status-to-blocked/:userId",
  changeAccountStatusToBlocked
);

// Cambiar status de cuenta de bloqueado a activo
router.post(
  "/change-account-status-to-active/:userId",
  changeAccountStatusToActive
);

module.exports = router;
