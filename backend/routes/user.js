const express = require('express');
const { listUsers, changeToAdmin, changeToCurrent, changeAccountStatusToBlocked, changeAccountStatusToActive } = require('../controllers/userController');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = express.Router();

// Middleware for JWT validation and field validation
router.use(validateJWT);

// Rutas
router.get('/list-users', listUsers);
router.post('/change-to-admin/:userId', changeToAdmin);
router.post('/change-to-current/:userId', changeToCurrent);
router.post('/change-account-status-to-blocked/:userId', changeAccountStatusToBlocked);
router.post('/change-account-status-to-active/:userId', changeAccountStatusToActive);

module.exports = router;
