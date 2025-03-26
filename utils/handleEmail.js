const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const CreateTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Error al obtener el token de acceso: " + err);
      }
      resolve(token);
    });
  });
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
  return transporter;
};

const sendEmail = async (emailOptions) => {
  try {
    let emailTransporter = await CreateTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
