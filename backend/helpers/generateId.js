const generateID = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const caracteresLength = caracteres.length;
  let id = "";

  for (let i = 0; i < 32; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteresLength);
    id += caracteres.charAt(indiceAleatorio);
  }

  return id;
};

module.exports = generateID;
