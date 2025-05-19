const { matchedData } = require("express-validator");
const { usersModel } = require("../models/index");
const { handleHttpError } = require("../utils/handleHttpError");
const { tokenVerify } = require("../utils/handleJWT");
const { storageModel } = require("../models/index");
const uploadToPinata = require("../utils/handleUploadIPFS");
const { compare, encrypt } = require("../utils/handlePassword");
const sendEmail = require("../utils/handleEmail"); // Usa tu helper

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

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await usersModel.findById(userId).select("+password");
    if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) return handleHttpError(res, "WRONG_OLD_PASSWORD", 400);

    user.password = await encrypt(newPassword);
    await user.save();
    res.json({ message: "PASSWORD_CHANGED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_CHANGING_PASSWORD");
  }
};

// Soft delete (archivar usuario)
const softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await usersModel.delete({ _id: userId });
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
    await usersModel.deleteOne({ _id: userId });
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
    await usersModel.restore({ _id: userId });
    res.json({ message: "USER_RESTORED" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_RESTORING_USER");
  }
};

const inviteUser = async (req, res) => {
  try {
    const { email, name, surnames } = req.body;
    const inviter = req.user;

    // Comprueba si ya existe usuario con ese email
    const existing = await usersModel.findOne({ email });
    if (existing) return handleHttpError(res, "USER_ALREADY_EXISTS", 409);

    // El usuario invitado hereda la company del invitador
    const invitedUser = await usersModel.create({
      email,
      name,
      surnames,
      company: inviter.company,
      pending: true,
      invitedBy: inviter._id,
    });

    await sendEmail({
      to: email,
      subject: "Invitación para unirse a la compañía",
      text: `Hola, has sido invitado a unirte a la compañía ${inviter.company.name}. 
Por favor accede a la aplicación y completa tu registro.`,
    });

    res.status(201).json({ message: "INVITATION_SENT" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_INVITING_USER");
  }
};

module.exports = {
  updateItem,
  updateCompany,
  updateLogo,
  softDeleteUser,
  hardDeleteUser,
  restoreUser,
  changePassword,
  inviteUser,
};
