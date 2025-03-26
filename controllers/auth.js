const { tokenSign } = require("../utils/handleJWT");
const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { usersModel } = require("../models/index");
const { createOTP } = require("../utils/handleOTP");
const { handleHttpError } = require("../utils/handleHttpError");
const { tokenVerify } = require("../utils/handleJWT");
const sendEmail = require("../utils/handleEmail");

const register = async (req, res) => {
  try {
    req = matchedData(req);
    const password = await encrypt(req.password);
    const verificationCode = createOTP();
    const body = { ...req, password, verificationCode };
    await sendEmail({
      to: req.email,
      subject: "Verification code",
      text: `Your verification code is ${verificationCode}`,
    });
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

const verify = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await tokenVerify(token);
    const user = await usersModel.findById(dataToken._id);
    if (user.verified) {
      return handleHttpError(res, "USER_ALREADY_VERIFIED", 401);
    }
    if (user.verificationCode != req.body.code) {
      user.verificationAttempts -= 1;
      const data = await usersModel.findByIdAndUpdate(dataToken._id, user, {
        new: true,
      });
      return handleHttpError(res, "INVALID_VERIFICATION_CODE", 401);
    } else {
      user.verified = true;
      const data = await usersModel.findByIdAndUpdate(dataToken._id, user, {
        new: true,
      });
      res.send("User verified");
    }
  } catch (error) {
    return handleHttpError(res, "USER_NOT_FOUND", 401);
  }
};

const login = async (req, res) => {
  try {
    req = matchedData(req);
    const dataUser = await usersModel.findOne({ email: req.email });
    if (!dataUser) {
      res.status(401).send({ message: "INCORRECT_MAIL_OR_PASS" });
      return;
    }
    const comparePassword = await compare(req.password, dataUser.password);
    if (!comparePassword) {
      res.status(401).send({ message: "INCORRECT_MAIL_OR_PASS" });
      return;
    }
    dataUser.set("password", undefined, { strict: false });
    dataUser.set("verificationCode", undefined, { strict: false });
    dataUser.set("verificationAttempts", undefined, { strict: false });
    const data = {
      token: await tokenSign(dataUser),
      user: dataUser,
    };
    res.send(data);
  } catch (error) {
    return handleHttpError(res, "USER_NOT_FOUND", 401);
  }
};

module.exports = { register, verify, login };
