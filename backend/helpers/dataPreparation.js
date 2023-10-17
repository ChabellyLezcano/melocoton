const BoardGame = require("../models/Boardgame");
const FavoriteGame = require("../models/Favorite");
const Review = require("../models/Review");
const Reservation = require("../models/Reservation");

const getFavoriteTags = async (userId) => {
    const favoriteGames = await FavoriteGame.find({ user: userId }).populate('game');
    const tagCountMap = new Map();
    
    favoriteGames.forEach((favoriteGame) => {
      favoriteGame.game.tags.forEach((tag) => {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      });
    })
    
    const uniqueTagsWithCount = Array.from(tagCountMap, ([tag, count]) => ({ tag, count }));
    return uniqueTagsWithCount;
  };
  
  const getReservedTags = async (userId) => {
    const reservations = await Reservation.find({ user: userId }).populate('game');
    const tagCountMap = new Map();
  
    reservations.forEach((reservation) => {
      reservation.game.tags.forEach((tag) => {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      });
    });
  
    const uniqueTagsWithCount = Array.from(tagCountMap, ([tag, count]) => ({ tag, count }));
    return uniqueTagsWithCount;
  };
  
  const getReviewTags = async (userId) => {
    const reviews = await Review.find({ user: userId, rating: { $gte: 4 } }).populate('game');
    const tagCountMap = new Map();
  
    reviews.forEach((review) => {
      review.game.tags.forEach((tag) => {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      });
    });
  
    const uniqueTagsWithCount = Array.from(tagCountMap, ([tag, count]) => ({ tag, count }));
    return uniqueTagsWithCount;
  };
  
  const combineAndSumTags = async (userId) => {
    const favoriteTags = await getFavoriteTags(userId);
    const reviewTags = await getReviewTags(userId);
    const reservedTags = await getReservedTags(userId);
  
    // Obtener todas las etiquetas únicas de las tres fuentes
    const allTags = new Set();
    [favoriteTags, reviewTags, reservedTags].forEach((tagList) => {
      tagList.forEach(({ tag }) => {
        allTags.add(tag);
      });
    });
  
    // Convertir las etiquetas a una matriz
    const allTagsArray = Array.from(allTags);
  
    // Seleccionar aleatoriamente una cantidad mayor de etiquetas del usuario, por ejemplo, 10 etiquetas
    const randomTags = [];
    while (randomTags.length < 10 && allTagsArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * allTagsArray.length);
      randomTags.push(allTagsArray[randomIndex]);
      allTagsArray.splice(randomIndex, 1);
    }
  
    const combinedTags = new Map();
  
    [favoriteTags, reviewTags, reservedTags].forEach((tagList) => {
      tagList.forEach(({ tag, count }) => {
        if (randomTags.includes(tag)) {
          combinedTags.set(tag, (combinedTags.get(tag) || 0) + count);
        }
      });
    });
  
    const uniqueTagsWithCount = Array.from(combinedTags, ([tag, count]) => ({ tag, count }));
    return uniqueTagsWithCount;
  };
  
  const generateRecommendations = async (userId) => {
    const userTags = await combineAndSumTags(userId);
    const allTags = userTags.map((tagCount) => tagCount.tag);
  
    const recommendations = await BoardGame.find({ tags: { $in: allTags } })
      .sort({ tags: -1 }) // Ordenar por la cantidad de tags coincidentes de mayor a menor
      .limit(20); // Obtener los 20 mejores juegos
  
    if (recommendations.length < 20) {
      // Si no hay suficientes recomendaciones basadas en etiquetas, agrega más juegos aleatorios
      const additionalRandomRecommendations = await BoardGame.aggregate([
        { $match: { _id: { $nin: recommendations.map((game) => game._id) } } },
        { $sample: { size: 20 - recommendations.length } }, // Selecciona 20 - n juegos aleatorios adicionales
      ]);
  
      recommendations.push(...additionalRandomRecommendations);
    }
  
    // Ahora, selecciona aleatoriamente 5 juegos de las 20 recomendaciones
    const randomRecommendations = [];
    while (randomRecommendations.length < 5 && recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      randomRecommendations.push(recommendations[randomIndex]);
      recommendations.splice(randomIndex, 1);
    }
  
    return randomRecommendations;
  };
  
  
  

  module.exports = {generateRecommendations}