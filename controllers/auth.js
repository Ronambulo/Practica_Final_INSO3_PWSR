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

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersModel.findOne({ email });
    if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);

    const code = createOTP(); // Por ejemplo, un número de 6 dígitos
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset Code",
      text: `Your code is: ${code}`,
    });

    res.json({ message: "RESET_CODE_SENT" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_REQUESTING_PASSWORD_RESET");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await usersModel.findOne({ email });

    if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);
    if (
      !user.resetPasswordCode ||
      user.resetPasswordCode !== code ||
      Date.now() > user.resetPasswordExpires
    ) {
      return handleHttpError(res, "INVALID_OR_EXPIRED_CODE", 400);
    }

    user.password = await encrypt(newPassword);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "PASSWORD_RESET_OK" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_RESETTING_PASSWORD");
  }
};

module.exports = {
  register,
  verify,
  login,
  requestPasswordReset,
  resetPassword,
};
