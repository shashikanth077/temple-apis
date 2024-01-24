const { isValidDateDDMMYYYYFormat, isDateInPresentOrFuture } = require("./dateHelper");
const { isNullOrUndefined, concatenateNames } = require("./dataHelper");
const { generateUniqueKey } = require("./uuidGenerator");
const { generateUniqueBookingId } = require("./bookingIdGenerator");
const { convertStringToObjectId } = require("./mongoUtils");
const {getStorage} = require("./fileUpload");

module.exports = {
    isValidDateDDMMYYYYFormat,
    isDateInPresentOrFuture,
    isNullOrUndefined,
    concatenateNames,
    generateUniqueKey,
    generateUniqueBookingId,
    convertStringToObjectId,
    getStorage
};
