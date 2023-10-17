
// Función para obtener un elemento aleatorio del array y combinarlo con la URL base
function randomImage() {
    const cloudAvatarURL = process.env.CLOUD_AVATAR_IMAGES;

// Define el array de images
const images = [
  'v850oc9mqgnfcz4spqxk',
  'gcjglxizquwnxpe97tqv',
  'mqd1i0gqrlzds0gyivbg',
  'jjmwcfodj1ibetcqqjzx',
  'dhl3iakvu242py9tukrb',
  'uij8cbmvx0gyi808va5o',
  'hw7idfawpjuuttv5iraq',
  'hlzgpppe2i4qsh8paqoc',
  'rcw3sysmlotpzw4nbdna',
  'xn55xpj8gv40wcxfn2us',
];

  // Genera un número aleatorio entre 0 y la longitud del array - 1
  const indiceAleatorio = Math.floor(Math.random() * images.length);

  // Obtiene el elemento aleatorio del array
  const elementoAleatorio = images[indiceAleatorio];

  // Combina el elemento con la URL base
  const urlCompleta = `${cloudAvatarURL}/${elementoAleatorio}`;

  return urlCompleta;
}

module.exports = {randomImage}
