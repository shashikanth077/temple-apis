const JWT = require("jsonwebtoken");
const User = require("../../models/auth/userModel");
const Token = require("../../models/auth/tokenModel");
const otpModel = require("../../models/auth/tokenModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Email = require("../../utils/sendEmail");

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
const { generateRandomOtp } = require("../../utils");

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
  new Email(user, link, "Reset password link").sendPasswordReset();
  const data = { success: true, message: link };
  return { data, status: 200 };
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    return {
      success: false,
      message: "Invalid or expired password reset token",
      status: 404,
    };
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    return {
      success: false,
      message: "Invalid or expired password reset token",
      status: 404,
    };
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });
  new Email(user, "", "Reset password successfull").resetPassword();

  await passwordResetToken.deleteOne();
  return { success: true, message: "Password reset successfull", status: 200 };
};

const generateandSaveOTP = async (phoneNumber) => {
  await otpModel.deleteMany({ phoneNumber });

  const otp = generateRandomOtp();
  const otpDocument = new otpModel({
    phoneNumber,
    otp,
  });

  try {
    await otpDocument.save();
    const data = { success: true, otp: otp, message: "otp inserted" };
    return { data, status: 200 };
  } catch (error) {
    const data = { success: false, message: error };
    return { data, status: 500 };
  }
};

const VerifyOTP = async (phoneNumber, userOTP) => {
  const otpDocument = await otpModel
    .findOne({ phoneNumber, otp: userOTP })
    .exec();

  try {
    if (otpDocument) {
      await User.findOneAndUpdate(
        { phonenumber: phoneNumber },
        { $set: { IsPhoneActive: true } },
        { runValidators: true, new: true }
      );
      await otpDocument.remove();
      const data = { success: true, otpStatus: true, message: "valid" };
      return { data, status: 200 };
    } else {
      const data = { success: false, otpStatus: false, message: "Invalid OTP" };
      return { data, status: 404 };
    }
  } catch (error) {
    const data = { success: false, message: error };
    return { data, status: 500 };
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  generateandSaveOTP,
  VerifyOTP,
};
