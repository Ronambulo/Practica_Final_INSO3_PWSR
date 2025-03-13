const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = (payload) => {
  const sign = jwt.sign(
    {
      _id: payload._id,
      role: payload.role,
    },
    JWT_SECRET,
    {
      expiresIn: "10h",
    }
  );
  return sign;
};

const tokenVerify = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return false;
  }
};

module.exports = { tokenSign, tokenVerify };
