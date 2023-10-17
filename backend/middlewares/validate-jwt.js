const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Error in token",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.id = id;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Not valid token",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
