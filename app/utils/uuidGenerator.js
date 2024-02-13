const uuid = require('uuid');

const generateUniqueKey =() => {
  return uuid.v4();
}

const generateUniqueNumber = () => {
  const currentYear = new Date().getFullYear();
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  const uniqueNumber = `${currentYear}/${randomSixDigitNumber}`;
  return uniqueNumber;
}

const generateRandomOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); 
}

module.exports = {
    generateUniqueKey,
    generateUniqueNumber,
    generateRandomOtp
}
