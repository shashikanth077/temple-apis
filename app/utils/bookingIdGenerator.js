const crypto = require("crypto");

const generateUniqueBookingId = () => {
  const timestamp = Date.now().toString();
  // Generate a random number (6 digits)
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  const ticketId = timestamp + randomPart;

  return ticketId.slice(-6);
};

module.exports = {
  generateUniqueBookingId,
};
