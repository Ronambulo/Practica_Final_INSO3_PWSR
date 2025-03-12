const { tokenSign } = require("../utils/handleJWT");
const { matchedData } = require("express-validator");
const { encrypt } = require("../utils/handlePassword");
const { usersModel } = require("../models/index");

const register = async (req, res) => {
  req = matchedData(req);
  const password = await encrypt(req.password);
  const body = { ...req, password };
  const dataUser = await usersModel.create(body);
  dataUser.set("password", undefined, { strict: false });
  const data = {
    token: await tokenSign(dataUser),
    user: dataUser,
  };
  res.send(data);
};

module.exports = { register };
