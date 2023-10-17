const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Stingray-uploads",
    allowed_formats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });


module.exports = upload