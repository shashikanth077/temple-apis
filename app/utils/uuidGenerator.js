const uuid = require("uuid");

const generateUniqueKey = () => {
  return uuid.v4();
};

const generateUniqueNumber = () => {
  const currentYear = new Date().getFullYear();
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  const uniqueNumber = `${currentYear}/${randomSixDigitNumber}`;
  return uniqueNumber;
};

const generateRandomOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

function generateRandomPassword() {
  const length = 8;
  const charset = "0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

module.exports = {
  generateUniqueKey,
  generateUniqueNumber,
  generateRandomOtp,
  generateRandomPassword,
};
