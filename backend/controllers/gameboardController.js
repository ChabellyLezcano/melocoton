const {  generateRandCode } = require("../helpers/generateRandCode");
const { shuffleArrayNoChangeOrden } = require("../helpers/ordenArray");
const BoardGame = require("../models/Boardgame");
const { User } = require("../models/User");

// Crear juego de mesa
const createBoardGame = async (req, res) => {
  const { title, description, status, tags, objective, rules } = req.body;

  try {
    const userId = req.id;

    // Generate a unique code for the new game
    let code;
    let isCodeUnique = false;

    // Continue generating a code until it's unique
    while (!isCodeUnique) {
      code = generateRandCode(); // Use your randCode() function to generate a code

      const existingGame = await BoardGame.findOne({ code });
      if (!existingGame) {
        isCodeUnique = true;
      }
    }

    // Buscar al usuario en el modelo User por su ID
    const user = await User.findById(userId);

    // Verificar si el usuario tiene el rol "Admin"
    if (user.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para crear juegos de mesa",
      });
    }

    // Si no existe un juego de mesa con el mismo nombre, creamos uno nuevo
    const newBoardGame = new BoardGame({
      title,
      description,
      status,
      objective,
      rules,
      tags,
      code, // Add the generated code to the game
    });

    console.log(newBoardGame)

    const createdGame = await newBoardGame.save();

    res.status(201).json({
      ok: true,
      msg: "Juego de mesa creado correctamente",
      game: createdGame,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el juego de mesa",
    });
  }
};

// Borrar juego de mesa
const deleteBoardGame = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos el juego de mesa por ID
    const game = await BoardGame.findById(id);

    // Verificamos si el juego de mesa existe
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "El juego de mesa no existe",
      });
    }

    // Borramos el juego de mesa de la base de datos
    await game.deleteOne();

    res.json({
      ok: true,
      msg: "Juego de mesa eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el juego de mesa",
    });
  }
};

// Editar juego de mesa
const editBoardGame = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos el juego de mesa por ID
    const game = await BoardGame.findOne({ _id: id });

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "El juego de mesa no existe",
      });
    }

    // Actualizamos los campos del juego de mesa
    const gameData = req.body;

    game.set(gameData);

    console.log(gameData)

    // Guardamos el juego de mesa actualizado en la base de datos
    await game.save();

    res.json({
      ok: true,
      msg: "Juego de mesa editado correctamente",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el juego de mesa",
    });
  }
};

// Listar juegos de mesa disponibles
const getBoardGames = async (req, res) => {
  try {
    const games = await BoardGame.find();

    
    res.json({
      ok: true,
      games: games,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado. Contacte con el administrador",
    });
  }
};

// Obtener un juego de mesa por ID
const getBoardGameById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos el juego de mesa por su ID
    const game = await BoardGame.findById(id);

    // Verificamos si el juego de mesa existe
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "El juego de mesa no existe",
      });
    }

    res.json({
      ok: true,
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el juego de mesa",
    });
  }
};

// Actualizar foto de juego de mesa
const updateBoardGamePhoto = async (req, res) => {
  const { id } = req.params;

  const userId = req.id

  try {
    const user = await User.findById(userId);

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (user.role !== 'Admin') {
      return res.status(403).json({
        ok: false,
        msg: "No estás autorizado para realizar esta operación. Solo los administradores pueden actualizar fotos de juegos de mesa",
      });
    }

    // Buscamos el juego de mesa por ID
    const game = await BoardGame.findById(id);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "El juego de mesa no existe",
      });
    }

    // Verificamos si se proporciona una nueva foto en la solicitud
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        msg: "Debes proporcionar una nueva foto para actualizar el juego de mesa",
      });
    }

    // Actualizamos la foto del juego de mesa
    game.photo = req.file.path;

    // Guardamos el juego de mesa actualizado en la base de datos
    await game.save();

    res.json({
      ok: true,
      msg: "Foto del juego de mesa actualizada correctamente",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la foto del juego de mesa. Solo se aceptan formatos jpg, png y",
    });
  }
};

// Actualizar imágenes de la galería de un juego de mesa
const updateBoardGameGalleryImages = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;

  try {

    const user = await User.findById(userId);

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (user.role !== 'Admin') {
      return res.status(403).json({
        ok: false,
        msg: "No estás autorizado para realizar esta operación. Solo los administradores pueden actualizar fotos de juegos de mesa",
      });
    }

    // Buscamos el juego de mesa por ID
    const game = await BoardGame.findById(id);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "El juego de mesa no existe",
      });
    }

    // Verificamos si se proporcionan nuevas imágenes en la solicitud
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Debes proporcionar al menos una imagen para actualizar el juego de mesa",
      });
    }

    // Verificamos si el juego de mesa ya tiene imágenes
    if (!game.gallery_images) {
      game.gallery_images = [];
    }

    // Limitamos la cantidad de imágenes a un máximo de 3
    if (game.gallery_images.length + req.files.length > 3) {
      return res.status(400).json({
        ok: false,
        msg: "No puedes agregar más de 3 imágenes al juego de mesa",
      });
    }

    // Agregamos las nuevas imágenes al campo 'gallery_images' y las etiquetamos
    for (let i = 0; i < req.files.length; i++) {
      const fieldName = `image${i + 1}`;
      game.gallery_images.push({ label: fieldName, path: req.files[i].path });
    }

    // Guardamos el juego de mesa actualizado en la base de datos
    await game.save();

    res.json({
      ok: true,
      msg: "Imágenes del juego de mesa actualizadas correctamente",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar las imágenes del juego de mesa",
    });
  }
};

module.exports = {
  createBoardGame,
  deleteBoardGame,
  editBoardGame,
  getBoardGames,
  getBoardGameById,
  updateBoardGamePhoto,
  updateBoardGameGalleryImages 
};
