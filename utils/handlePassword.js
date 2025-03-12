const bcrypt = require("bcryptjs");

const encrypt = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const compare = async (password, hash) => {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
};

module.exports = { encrypt, compare };
