const express = require('express');
const { getUserInfo, updatePhoto, updateUsername } = require('../controllers/profileController');
const router = express.Router();


// Ruta para obtener la información del usuario
router.get('/get-profile',getUserInfo );

// Ruta para actualizar la foto de perfil del usuario
router.put('/update-photo', upload.single('photo') ,updatePhoto);

// Ruta para actualizar el nombre de usuario del usuario
router.put('/update-username', updateUsername);

module.exports = router;
