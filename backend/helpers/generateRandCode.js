function generateRandCode() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Lista de letras mayúsculas, minúsculas y números
  let randomCode = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }

  return randomCode;
}

function generateRandCodeReservation() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Lista de letras mayúsculas, minúsculas y números
  let randomCode = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }

  return randomCode;
}


module.exports = {
  generateRandCode,
  generateRandCodeReservation
};
