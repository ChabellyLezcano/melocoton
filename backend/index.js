const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const { dbConnection } = require("./config/database");
const configureCloudinary = require ("./config/cloudinary")
require("dotenv").config();

// Crear la aplicación de express
const app = express();

// Crear el servidor HTTP utilizando Express
const server = http.createServer(app);

// Configura Socket.IO para trabajar con el servidor HTTP
const io = socketIo(server);

app.use((req, res, next) => {
  req.io = io; // Asignar la instancia de Socket.IO a req.io
  next();
});


// Conexión a la base de datos
dbConnection();
configureCloudinary();

// Directorio público
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Middleware CORS
app.use(cors({ exposedHeaders: ["token"] }));

// Middleware de análisis de cuerpo de solicitud
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/game", require("./routes/gameboard"));
app.use("/api/reservationAdmin", require("./routes/reservationAdmin"));
app.use("/api/reservationUser", require("./routes/reservationUser"));
app.use("/api/review", require("./routes/review"));
app.use("/api/forum", require("./routes/message_forum"));
app.use("/api/favorite", require("./routes/listFavorite"));
app.use("/api/recommendation", require("./routes/recommendation"));


// Inicio del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

