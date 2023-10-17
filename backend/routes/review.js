const express = require("express");
const router = express.Router();
const {
  createReview,
  editReview,
  deleteReview,
  getGameReviews,
  getUserReviews,
  getAverageRatingForGame,
} = require("../controllers/reviewController");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// Middleware for JWT validation and field validation
router.use(validateJWT, validateFields);

// Route to create a new review
router.post("/create-review/:gameId", createReview);

// Route to edit an existing review
router.put("/edit-review/:reviewId", editReview);

// Route to delete an existing review
router.delete("/delete-review/:reviewId", deleteReview);

// Route to get all reviews for a specific game
router.get("/game-reviews/:gameId", getGameReviews);

// Route to get all reviews for a specific user
router.get("/user-reviews/:userId", getUserReviews);

// Route to get the average rating of reviews for a specific game
router.get("/average-rating-reviews/:gameId", getAverageRatingForGame);

module.exports = router;
