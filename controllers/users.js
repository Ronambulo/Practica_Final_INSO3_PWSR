const { matchedData } = require("express-validator");
const { usersModel } = require("../models/index");
const { handleHttpError } = require("../utils/handleHttpError");
const { tokenVerify } = require("../utils/handleJWT");
const { storageModel } = require("../models/index");
const uploadToPinata = require("../utils/handleUploadIPFS");

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

const updateCompany = async (req, res) => {
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

const updateLogo = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const pinataResponse = await uploadToPinata(fileBuffer, fileName);
    //console.log("response:     " + pinataResponse);
    const ipfsFile = pinataResponse.IpfsHash;
    const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;
    const data = await storageModel.create({ filename: fileName, url: ipfs });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR_UPLOAD_IMAGE");
  }
};

// Soft delete (archivar usuario)
const softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await UsersModel.delete({ _id: userId });
    res.json({ message: "USER_SOFT_DELETED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_SOFT_DELETING_USER");
  }
};

// Hard delete (borrado físico)
const hardDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await UsersModel.deleteOne({ _id: userId });
    res.json({ message: "USER_HARD_DELETED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_HARD_DELETING_USER");
  }
};

// Restaurar usuario archivado
const restoreUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await UsersModel.restore({ _id: userId });
    res.json({ message: "USER_RESTORED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_RESTORING_USER");
  }
};

module.exports = {
  updateItem,
  updateCompany,
  updateLogo,
  softDeleteUser,
  hardDeleteUser,
  restoreUser,
};
