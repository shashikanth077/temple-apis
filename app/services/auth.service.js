const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Email = require('./../utils/sendEmail');

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  new Email(user,link,'Reset password link').sendPasswordReset();
  const data = { success: true, message: link };
  return { data, status: 200 };
};

const resetPassword = async (userId, token, password) => {

  console.log(userId);
  console.log(token);
  console.log(password);
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
     return { success: false,
      message: "Invalid or expired password reset token", status: 404 };
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    return { success: false, message: "Invalid or expired password reset token", status: 404 };
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  new Email(user,'','Reset password successfull').resetPassword();

  await passwordResetToken.deleteOne();

  return { success: true, message: "Password reset successfull", status: 200 };
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
