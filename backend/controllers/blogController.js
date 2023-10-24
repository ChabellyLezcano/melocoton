const Article = require("../models/Article");
const { User } = require("../models/User");

// Controlador para crear un nuevo artículo con el usuario como autor
const createArticle = async (req, res) => {
  try {
    const userId = req.id; // Asumiendo que req.id contiene el ID del usuario actual

    // Buscar al usuario por su ID en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Comprobar si el usuario tiene el rol de Admin
    if (user.role !== "Admin") {
      return res.status(403).json({ error: "No tienes permisos para crear un artículo" });
    }

    // Extraer los datos del artículo del cuerpo de la solicitud
    const { tags, ...articleData } = req.body;

    // Verificar si 'tags' está presente y es una cadena
    if (typeof tags === "string") {
      // Separar las etiquetas por comas y limpiar los espacios
      const articleTags = tags.split(",").map((tag) => tag.trim());
      // Crear un nuevo artículo con el usuario como autor y las etiquetas procesadas
      const newArticle = new Article({
        ...articleData,
        author: user._id,
        tags: articleTags,
      });
      await newArticle.save();
      res.status(201).json(newArticle);
    } else {
      res.status(400).json({ error: "Los datos del artículo son inválidos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "No se pudo crear el artículo" });
  }
};


// Controlador para obtener todos los artículos con el username del autor
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "username photo");

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

    res
      .status(200)
      .json({
        ok: true,
        msg: "Lista de articulos",
        articles: articlesWithLikes,
      });
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
      "username photo"
    );
    if (!article) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res
      .status(200)
      .json({ ok: true, msg: "Articulo obtenido", article: article });
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
    const likedByUser = article.likes.some(
      (like) => like.user.toString() === userId
    );

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
    const likedByUser = article.likes.some(
      (like) => like.user.toString() === userId
    );

    if (!likedByUser) {
      return res
        .status(400)
        .json({ error: "No has dado like a este artículo" });
    }

    // Filtrar el like del usuario del artículo
    article.likes = article.likes.filter(
      (like) => like.user.toString() !== userId
    );
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
      
      if (req.body.tags) {
        // Verificamos si 'tags' está presente y es una cadena
        if (typeof req.body.tags === "string") {
          article.tags = req.body.tags.split(",").map((tag) => tag.trim());
        } else {
          article.tags = req.body.tags;
        }
      }

      try {
        await article.save();
        res.status(200).json({ ok: true, msg: "Articulo actualizado correctamente", article });
      } catch (saveError) {
        console.error(saveError);
        res.status(500).json({ error: "No se pudo guardar la edición del artículo" });
      }
    } else {
      res.status(403).json({ error: "No tienes permisos para editar este artículo" });
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

// Actualizar foto de artículo
const updateArticlePhoto = async (req, res) => {
  const { id } = req.params;

  const userId = req.id;

  try {
    const user = await User.findById(userId);

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (user.role !== "Admin") {
      return res.status(403).json({
        ok: false,
        msg: "No estás autorizado para realizar esta operación. Solo los administradores pueden actualizar fotos de los artículos",
      });
    }

    // Buscamos el artículo por ID
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        ok: false,
        msg: "El artículo a no existe",
      });
    }

    // Verificamos si se proporciona una nueva foto en la solicitud
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        msg: "Debes proporcionar una nueva foto para actualizar el artículo",
      });
    }

     // Actualizamos la foto del juego de mesa
    article.photo = req.file.path;

    // Guardamos el artículo actualizado en la base de datos
    await article.save();

    res.json({
      ok: true,
      msg: "Foto del artículo actualizada correctamente",
      article,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la foto del artículo. Solo se aceptan formatos jpg, png y",
    });
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
  updateArticlePhoto
};
