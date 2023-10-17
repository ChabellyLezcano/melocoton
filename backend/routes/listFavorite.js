const express = require("express");
const router = express.Router();
const {markAsFavorite, unmarkAsFavorite, listFavorites} = require("../controllers/listFavoriteController");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// JWT validation middleware
router.use(validateJWT, validateFields);

// Mark a game as favorite
router.post("/add-favorite/:gameId", markAsFavorite);

// Unmark game as favorite
router.delete("/unfavorite/:gameId", unmarkAsFavorite);

// List favorite games
router.get("/list-favorites", listFavorites);

module.exports = router;
