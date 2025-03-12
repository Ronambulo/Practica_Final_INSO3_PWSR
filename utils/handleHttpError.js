const handleHttpError = (res, message, code = 403) => {
  res.status(code).json({ message });
};

module.exports = { handleHttpError };
