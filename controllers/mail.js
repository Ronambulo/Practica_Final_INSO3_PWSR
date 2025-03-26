const sendEmail = require("../utils/handleEmail");
const { handleHttpError } = require("../utils/handleHttpError");
const { matchedData } = require("express-validator");

const sendItem = async (req, res) => {
  try {
    const info = matchedData(req);
    const data = await sendEmail(info);
    res.send(data);
  } catch (err) {
    handleHttpError(res, err.message);
  }
};

module.exports = { sendItem };
