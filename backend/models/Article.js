const mongoose = require('mongoose');

// Definir el esquema del artículo
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tags: [String], // Array de etiquetas
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de usuario
    required: true,
  },
  photo: String, // URL de la foto
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario
      },
    },
  ],
});

// Modelo de artículo
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
