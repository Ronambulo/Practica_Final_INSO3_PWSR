const { matchedData } = require("express-validator");
const { usersModel } = require("../models/index");
const { handleHttpError } = require("../utils/handleHttpError");
const { tokenVerify } = require("../utils/handleJWT");

const updateItem = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await tokenVerify(token);

    const reqData = matchedData(req);
    const dataUser = await usersModel.findByIdAndUpdate(
      dataToken._id,
      reqData,
      {
        new: true,
      }
    );
    dataUser.set("password", undefined, { strict: false });
    dataUser.set("verificationCode", undefined, { strict: false });
    dataUser.set("verificationAttempts", undefined, { strict: false });
    res.send(dataUser);
  } catch {
    return handleHttpError(res, "USER_NOT_FOUND", 401);
  }
};

module.exports = { updateItem };
