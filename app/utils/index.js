const {
  isValidDateDDMMYYYYFormat,
  isDateInPresentOrFuture,
  getCurrentDate,
} = require("./dateHelper");
const { isNullOrUndefined, concatenateNames } = require("./dataHelper");
const {
  generateUniqueKey,
  generateUniqueNumber,
  generateRandomOtp,
  generateRandomPassword,
} = require("./uuidGenerator");
const { generateUniqueBookingId } = require("./bookingIdGenerator");
const { convertStringToObjectId } = require("./mongoUtils");
const { getStorage } = require("./fileUpload");

module.exports = {
  isValidDateDDMMYYYYFormat,
  isDateInPresentOrFuture,
  isNullOrUndefined,
  concatenateNames,
  generateRandomPassword,
  generateRandomOtp,
  generateUniqueNumber,
  getCurrentDate,
  generateUniqueKey,
  generateUniqueBookingId,
  convertStringToObjectId,
  getStorage,
};
