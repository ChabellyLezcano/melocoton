const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
  const payload = { id };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "122h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
