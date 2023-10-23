const Article = require('../models/Article');
const { User } = require('../models/User');

// Controlador para crear un nuevo artículo con el usuario como autor
const createArticle = async (req, res) => {
    try {
      const userId = req.id; // Asumiendo que req.id contiene el ID del usuario actual
  
      // Buscar al usuario por su ID en la base de datos
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Comprobar si el usuario tiene el rol de Admin
      if (user.role !== 'Admin') {
        return res.status(403).json({ error: 'No tienes permisos para crear un artículo' });
      }
  
      // Asignar el usuario como autor del artículo
      const { tags, ...articleData } = req.body;
      const newArticleData = {
        ...articleData,
        author: userId,
        photo: req.file.path,
        tags: tags.split(',').map(tag => tag.trim()), // Separar por comas y limpiar espacios
      };
  
      const newArticle = new Article(newArticleData);
      await newArticle.save();
      res.status(201).json(newArticle);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'No se pudo crear el artículo', error });
    }
  };
  
// Controlador para obtener todos los artículos con el username del autor
const getAllArticles = async (req, res) => {
    try {
      const articles = await Article.find().populate("author", "username");
  
      // Obtener el número de "likes" para cada artículo y agregarlo como un nuevo atributo
      const articlesWithLikes = await Promise.all(
        articles.map(async (article) => {
          const numLikes = article.likes.length;
          return {
            ...article._doc, // Copiar los atributos originales del artículo
            numLikes, // Agregar el número de "likes" al artículo
          };
        })
      );
  
      res.status(200).json(articlesWithLikes);
    } catch (error) {
      res.status(500).json({ error: "No se pudieron obtener los artículos" });
    }
  };
  
// Controlador para obtener un artículo por su ID
const getArticleById = async (req, res) => {
  try {
    const userId = req.id;

    // Buscar al usuario por su ID en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const article = await Article.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!article) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el artículo" });
  }
};

// Controlador para dar like a un artículo
const likeArticle = async (req, res) => {
    const userId = req.id;
    const articleId = req.params.id;
  
    try {
      const article = await Article.findById(articleId);
  
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }
  
      // Verificar si el usuario ya ha dado like al artículo
      const likedByUser = article.likes.some((like) => like.user.toString() === userId);
  
      if (likedByUser) {
        return res.status(400).json({ error: "Ya diste like a este artículo" });
      }
  
      // Agregar el like del usuario al artículo
      article.likes.push({ user: userId });
      await article.save();
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ error: "No se pudo dar like al artículo" });
    }
  };
  
  // Controlador para quitar un like de un artículo
  const unlikeArticle = async (req, res) => {
    try {
      const userId = req.id;
      const articleId = req.params.id;
  
      const article = await Article.findById(articleId);
  
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }
  
      // Verificar si el usuario ha dado like al artículo
      const likedByUser = article.likes.some((like) => like.user.toString() === userId);
  
      if (!likedByUser) {
        return res.status(400).json({ error: "No has dado like a este artículo" });
      }
  
      // Filtrar el like del usuario del artículo
      article.likes = article.likes.filter((like) => like.user.toString() !== userId);
      await article.save();
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ error: "No se pudo quitar el like del artículo" });
    }
  };
  
// Controlador para editar un artículo (solo el autor o el rol Admin puede hacerlo)
const editArticle = async (req, res) => {
    try {
      const userId = req.id;
  
      // Buscar al usuario por su ID en la base de datos
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }
  
      // Comprobar si el usuario es el autor o tiene el rol de Admin
      if (
        user.role === "Admin" || // Asumiendo que la información del usuario se encuentra en req.user
        user._id.toString() === article.author.toString()
      ) {
        // Actualizar el artículo con los datos del cuerpo de la solicitud
        article.title = req.body.title;
        article.text = req.body.text;
        article.tags = req.body.tags;
        article.photo = req.body.photo;
  
        try {
          await article.save();
          res.status(200).json(article);
        } catch (saveError) {
          console.error(saveError);
          res.status(500).json({ error: "No se pudo guardar la edición del artículo" });
        }
      } else {
        res
          .status(403)
          .json({ error: "No tienes permisos para editar este artículo" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo editar el artículo" });
    }
  };
  

// Controlador para eliminar un artículo (solo el autor o el rol Admin puede hacerlo)
const deleteArticle = async (req, res) => {
    try {
      const userId = req.id;
  
      // Buscar al usuario por su ID en la base de datos
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }
  
      // Comprobar si el usuario es el autor o tiene el rol de Admin
      if (
        user.role === "Admin" || // Asumiendo que la información del usuario se encuentra en req.user
        user._id.toString() === article.author.toString()
      ) {
        await article.deleteOne(); // Utiliza deleteOne() para eliminar el artículo
        res.json({ ok: true, msg: "Artículo borrado" });
      } else {
        res
          .status(403)
          .json({ error: "No tienes permisos para eliminar este artículo" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo eliminar el artículo" });
    }
  };
  

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  likeArticle,
  unlikeArticle,
  editArticle,
  deleteArticle,
};
