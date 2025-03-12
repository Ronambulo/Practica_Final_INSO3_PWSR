const { tokenSign } = require("../utils/handleJWT");
const { matchedData } = require("express-validator");
const { encrypt } = require("../utils/handlePassword");
const { usersModel } = require("../models/index");
const { createOTP } = require("../utils/handleOTP");
const { handleHttpError } = require("../utils/handleHttpError");

const register = async (req, res) => {
  try {
    req = matchedData(req);
    const password = await encrypt(req.password);
    const verificationCode = createOTP();
    const body = { ...req, password, verificationCode };
    const dataUser = await usersModel.create(body);
    dataUser.set("password", undefined, { strict: false });
    dataUser.set("verificationCode", undefined, { strict: false });
    dataUser.set("verificationAttempts", undefined, { strict: false });
    const data = {
      token: await tokenSign(dataUser),
      user: dataUser,
    };
    res.send(data);
  } catch (error) {
    if (error.code === 11000) {
      return handleHttpError(res, "Email already exists", 409);
    }
  }
};

module.exports = { register };
