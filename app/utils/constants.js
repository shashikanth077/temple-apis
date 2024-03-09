const allowedWorshipDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const allowedUserRoles = ["user", "admin"];

const allowedBookingTypes = ["Regular", "Pre-Booking"];

const allowedServiceTypes = ["Archana", "Homam", "Pooja", "Seva"];

const allowedDonationTypes = ["Grocery", "Other"];

const PUBLIC_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

module.exports = {
  allowedUserRoles,
  allowedWorshipDays,
  allowedDonationTypes,
  allowedBookingTypes,
  allowedServiceTypes,
  PUBLIC_URL,
  CLIENT_URL
};
