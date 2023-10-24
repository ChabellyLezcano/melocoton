const { Router } = require("express");
const { check } = require("express-validator");
const upload = require("../middlewares/upload");
const router = Router();
const {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  likeArticle,
  unlikeArticle,
  updateArticlePhoto,
} = require("../controllers/blogController"); // Asegúrate de proporcionar la ruta correcta al archivo de controladores
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// Middleware de validación de JWT
router.use(validateJWT, validateFields);

// Crear un artículo
router.post(
  "/add-article",
  
  [
    check("title", "El título es requerido").notEmpty(),
    check("text", "El texto es requerido").notEmpty(),
    check("tags", "Las etiquetas son requeridas").isArray(),
  ],upload.single("photo"),
  createArticle
);

// Editar un artículo
router.put(
  "/edit-article/:id",
  [
    check("title", "El título es requerido").notEmpty(),
    check("text", "El texto es requerido").notEmpty(),
    check("tags", "Las etiquetas son requeridas").isArray(),
  ],
  editArticle
);

// Eliminar un artículo
router.delete("/delete-article/:id", deleteArticle);

// Listar todos los artículos disponibles
router.get("/articles", getAllArticles);

// Obtener un solo artículo por su ID
router.get("/get-article/:id", getArticleById);

// Dar like a un artículo
router.put('/like-article/:id', likeArticle);

// Quitar el like de un artículo
router.put('/unlike-article/:id', unlikeArticle);

router.put('/upload-article-photo/:id', upload.single('photo'), updateArticlePhoto);


module.exports = router;
