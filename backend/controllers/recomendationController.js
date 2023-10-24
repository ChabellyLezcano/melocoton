const Recommendation = require("../models/Recommendation");
const BoardGame = require("../models/Boardgame"); // Asegúrate de que la referencia sea correcta
const { generateRecommendations } = require("../helpers/dataPreparation");

// Controlador para generar juegos recomendados
const generateRecommendedGames = async (req, res) => {
  const userId = req.id; // Suponiendo que el userId se pasa como un parámetro en la solicitud

  try {
    // Busca una recomendación existente con el mismo userId
    const existingRecommendation = await Recommendation.findOne({ userId });

    if (existingRecommendation) {
      // Si existe una recomendación, actualízala
      const recommendations = await generateRecommendations(userId);
      existingRecommendation.recommendedGameIds = recommendations.map(
        (game) => game._id
      );
      await existingRecommendation.save();

      res.json({ok: true, msg:"Recoomendaciones generadas", recommendations});
    } else {
      // Si no existe una recomendación, crea una nueva
      const recommendations = await generateRecommendations(userId);
      const newRecommendation = new Recommendation({
        userId: userId,
        recommendedGameIds: recommendations.map((game) => game._id),
      });
      await newRecommendation.save();

      res.json({ok: true, msg:"Recoomendaciones generadas", recommendations});
    }
  } catch (error) {
    // Manejar errores, por ejemplo, enviando un mensaje de error en caso de que falle la generación o actualización de recomendaciones
    res
      .status(500)
      .json({ error: "Error al generar o actualizar recomendaciones" });
  }
};

const getRecommendedGamesByUserId = async (req, res) => {
  try {
    const userId = req.id;

    // Consulta las recomendaciones de la base de datos
    const recommendation = await Recommendation.findOne({ userId: userId });

    if (!recommendation) {
      res.status(404).json({
        ok: false,
        msg: "Recomendaciones no encontradas",
      });
      return;
    }

    // Obtén los juegos recomendados de la base de datos de BoardGame
    const recommendedGames = await BoardGame.find({
      _id: { $in: recommendation.recommendedGameIds },
    });

    res.json({
      ok: true,
      msg: "Recomendaciones encontradas",
      recommendedGames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener recomendaciones",
    });
  }
};

module.exports = {
  getRecommendedGamesByUserId,
  generateRecommendedGames,
};
