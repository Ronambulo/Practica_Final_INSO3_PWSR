const axios = require("axios");

const sendSlackError = async (error, req) => {
  try {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) return;
    const body = {
      text:
        `:rotating_light: *ERROR 5XX DETECTADO*\n` +
        `*Endpoint:* ${req.method} ${req.originalUrl}\n` +
        `*Error:* ${error.stack || error.toString()}\n` +
        `*Usuario:* ${req.user ? req.user.email : "No autenticado"}`,
    };
    await axios.post(url, body);
  } catch (err) {
    // No queremos romper la app por un error en Slack, solo log.
    console.error("Error notificando a Slack:", err.message);
  }
};

module.exports = sendSlackError;
