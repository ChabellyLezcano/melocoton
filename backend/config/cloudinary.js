const cloudinary = require("cloudinary").v2;

const configureCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    console.log("Configuración de Cloudinary exitosa");
  } catch (error) {
    console.error("Error al configurar Cloudinary:", error);
  }
};

module.exports = configureCloudinary;
