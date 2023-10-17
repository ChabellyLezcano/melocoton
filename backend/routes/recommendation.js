const express = require("express");
const router = express.Router();
const {  getRecommendedGamesByUserId, generateRecommendedGames } = require("../controllers/recomendationController");
const { validateJWT } = require("../middlewares/validate-jwt");

router.use(validateJWT)
// Ruta para generar juegos recomendados
router.post("/generate-recommended-games", generateRecommendedGames);

// Ruta para obtener recomendaciones por userId
router.get("/get-recommended-games",  getRecommendedGamesByUserId);

module.exports = router;
