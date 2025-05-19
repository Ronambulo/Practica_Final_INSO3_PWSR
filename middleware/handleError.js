const sendSlackError = require("../utils/notifySlack");

const handleError = (err, req, res, next) => {
  // Solo avisa a Slack si es un error 5XX
  if (res.statusCode >= 500 || (err.status && err.status >= 500)) {
    sendSlackError(err, req); // No bloquea, es async
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};

module.exports = handleError;
