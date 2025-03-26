const { handleHttpError } = require("../utils/handleHttpError");
const { tokenVerify } = require("../utils/handleJWT");
const { usersModel } = require("../models/index");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, { message: "No token provided", status: 401 });
      return;
    }
    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await tokenVerify(token);
    if (!dataToken._id) {
      handleHttpError(res, { message: "Invalid token", status: 401 });
      return;
    }
    const user = await usersModel.findById(dataToken._id);
    req.user = user;
    next();
  } catch {
    handleHttpError(res, { message: "NOT_SESSION", status: 401 });
  }
};

module.exports = { authMiddleware };
