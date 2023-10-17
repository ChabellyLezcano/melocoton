const { Router } = require("express");
const { check } = require("express-validator");
const upload = require("../middlewares/upload");
const router = Router();

const {uploadMultipleImages} = require('../middlewares/upload')

const {
  createBoardGame,
  deleteBoardGame,
  editBoardGame,
  getBoardGames,
  getBoardGameById,
  updateBoardGamePhoto,
  updateBoardGameGalleryImages,
} = require("../controllers/gameboardController"); // Make sure to provide the correct path to the controllers file
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// JWT validation middleware
router.use(validateJWT, validateFields);

// Create board game
router.post(
  "/add-game",
  upload.single("photo"),
  [
    check("foto", "Photo URL is required").notEmpty(),
    check("title", "Title is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("status", "Status is required").notEmpty(),
    check("tags", "Tags are required").isArray(),
  ],
  
  createBoardGame
);

// Edit board game
router.put(
  "/edit-game/:id",
  [
    check("foto", "Photo URL is required").notEmpty(),
    check("title", "Title is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("status", "Status is required").notEmpty(),
    check("tags", "Tags are required").isArray(),
  ],
  editBoardGame
);

// Delete board game
router.delete("/delete-game/:id", deleteBoardGame);

// List available board games
router.get("/get-games", getBoardGames);

// Get a single board game by ID
router.get("/get-single-game/:id", getBoardGameById);

router.put('/boardgames/:id', upload.single('photo'), updateBoardGamePhoto);

router.put('/add-gallery-image/:id',upload.array('image'), updateBoardGameGalleryImages);


module.exports = router;
