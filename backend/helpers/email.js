const nodemailer = require("nodemailer");
const { formatDate, formatTime } = require("./emailConfiguration");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmailConfirmation = async (email, token) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Confirma tu cuenta - Stingray",
      html: `
        <p>¡Hola!</p>
        <p>Gracias por unirte a la comunidad de Stingray. Estamos emocionados de tenerte a bordo.</p>
        <p>Para comenzar tu viaje con nosotros, por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
        <p><a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirmar mi cuenta</a></p>
        <p>Si no te registraste en Stingray, simplemente ignora este correo electrónico.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de confirmación de cuenta:",
      error
    );
  }
};

const sendEmailResetPassword = async (email, token) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Restablece tu contraseña - Stingray",
      html: `
        <p>¡Hola de nuevo!</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Stingray.</p>
        <p>Si estás listo para volver, simplemente sigue el enlace a continuación:</p>
        <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Restablecer mi contraseña</a></p>
        <p>Si no solicitaste el restablecimiento de contraseña, siéntete libre de ignorar este correo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de restablecimiento de contraseña:",
      error
    );
  }
};

const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Bienvenido a Stingray! - Stingray",
      html: `
        <p>¡Bienvenido, ${username}!</p>
        <p>Desde Stingray queremos darte las gracias por unirte a nuestra comunidad. Estamos felices de tenerte aquí.</p>
        <p>Esperamos que disfrutes de nuestros servicios y juegos. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Estamos aquí para ti!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de bienvenida:", error);
  }
};

const sendEmailNewReservation = async (email, reservation, game, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Reserva realizada con éxito en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Tu reserva con el código ${
          reservation.code
        } ha sido recibida con éxito.</p>
        <p>Estamos emocionados de que hayas elegido un juego de nuestra colección. Ahora, cuando el administrador confirme tu reserva, recibirás más instrucciones.</p>
        <p>Detalles de la reserva:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de reserva: ${formatDate(reservation.date)}</li>
        <li>Hora de reserva: ${formatTime(reservation.date)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        </ul>
        <p>¡Intenta estar pendiente a las novedades de tu reserva!</>
        <p>Gracias por confiar en Stingray.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de confirmación de reserva:",
      error
    );
  }
};

const sendEmailCancelReservation = async (
  email,
  reservation,
  game,
  username
) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Reserva cancelada en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Tu reserva con el código ${
          reservation.code
        } ha sido cancelada con éxito.</p>
        <p>Detalles de la reserva cancelada:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de reserva: ${formatDate(reservation.date)}</li>
        <li>Hora de reserva: ${formatTime(reservation.date)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        </ul>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        <p>¡En Stingray, estamos aquí para ti!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de cancelación de reserva:",
      error
    );
  }
};

const sendEmailReservationConfirmation = async (
  email,
  reservation,
  game,
  username
) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Reserva confirmada en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Tu reserva con el código ${
          reservation.code
        } ha sido confirmada con éxito por el administrador.</p>
        <p>A continuación, te proporcionamos los detalles:</p>
        <p>Detalles de la reserva:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de reserva: ${formatDate(reservation.date)}</li>
        <li>Hora de reserva: ${formatTime(reservation.date)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        <li>Fecha límite para la devolución del juego: ${formatDate(
          reservation.expirationDate
        )}</li>
        </ul>
        <p>Puedes pasarte a recoger el juego a partir del siguiente día hábil</p>
        <p>Recuerda devolver el juego antes de la fecha límite. ¡Esperamos que disfrutes de tu experiencia con Stingray!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de confirmación de reserva:",
      error
    );
  }
};

const sendEmailReservationRejection = async (
  email,
  reservation,
  game,
  username
) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Reserva rechazada en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Lamentablemente, tu reserva con el código ${
          reservation.code
        } ha sido rechazada.</p>
        <p>Motivo de rechazo: ${reservation.rejectionReason}</p>
        <p>Detalles de la reserva rechazada:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de reserva: ${formatDate(reservation.date)}</li>
        <li>Hora de reserva: ${formatTime(reservation.date)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        </ul>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Esperamos que sigas disfrutando de Stingray en el futuro!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de rechazo de reserva:", error);
  }
};

const sendEmailReservationPickedUp = async (
  email,
  reservation,
  game,
  username
) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Juego recogido en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Tu reserva con el código ${
          reservation.code
        } ha sido marcada como recogida.</p>
        <p>Debes devolver el juego en nuestro horario lectivo antes del ${formatDate(
          reservation.expirationDate
        )}.</p>
        <p>Detalles de la reserva:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de recogida: ${formatDate(reservation.takenDate)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        </ul>
        <p>¡Disfruta del juego y recuérdanos para tus futuras reservas! Si tienes alguna pregunta, estamos aquí para ayudarte.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de marcado como recogida:", error);
  }
};

const sendEmailReservationCompleted = async (
  email,
  reservation,
  game,
  username
) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "¡Juego devuelto en Stingray!",
      html: `
        <p>¡Hola, ${username}!</p>
        <p>Tu reserva con el código ${
          reservation.code
        } ha sido marcada como completada. Esto significa que has devuelto el juego y todo ha ido bien.</p>
        <p>Detalles de la reserva:</p>
        <ul>
        <li>Código del juego: ${game.code}</li>
        <li>Nombre del juego: ${game.title}</li>
        <li>Fecha de entrega: ${formatDate(reservation.endDate)}</li>
        <li>Fecha de expiración: ${formatDate(reservation.expirationDate)}</li>
        <li>Estado de la reserva: ${reservation.status}</li>
        </ul>
        <p>Esperamos volver a verte pronto para tu próxima reserva. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de marcado como completada:",
      error
    );
  }
};

const sendChangeToAdminEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Tu rol ha sido cambiado a Admin - Stingray",
      html: `
        <p>¡Hola ${username}!</p>
        <p>Tu rol en Stingray ha sido cambiado a "Admin".</p>
        <p>Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de cambio a Admin:", error);
  }
};

const sendChangeToCurrentEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Tu rol ha sido cambiado a Current - Stingray",
      html: `
        <p>¡Hola ${username}!</p>
        <p>Tu rol en Stingray ha sido cambiado a "Current".</p>
        <p>Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de cambio a Current:", error);
  }
};

const sendAccountStatusBlockedEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Tu cuenta ha sido bloqueada - Stingray",
      html: `
        <p>¡Hola ${username}!</p>
        <p>Tu cuenta en Stingray ha sido bloqueada por incumplir las normas de seguridad.</p>
        <p>Evaluaremos la situación y si la resolución resulta favorable la desbloquearemos</p>
        <p>Si crees que esto es un error o tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de cuenta bloqueada:", error);
  }
};

const sendAccountStatusActiveEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: '"Stingray"',
      to: email,
      subject: "Tu cuenta ha sido activada - Stingray",
      html: `
        <p>¡Hola ${username}!</p>
        <p>Tu cuenta en Stingray ha sido activada.</p>
        <p>¡Estamos encantados de que estés de vuelta! Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de cuenta activada:", error);
  }
};

module.exports = {
  sendEmailConfirmation,
  sendEmailResetPassword,
  sendWelcomeEmail,
  sendEmailCancelReservation,
  sendEmailReservationCompleted,
  sendEmailReservationPickedUp,
  sendEmailNewReservation,
  sendEmailReservationRejection,
  sendEmailReservationConfirmation,
  sendChangeToAdminEmail,
  sendChangeToCurrentEmail,
  sendAccountStatusBlockedEmail,
  sendAccountStatusActiveEmail,
};
