const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const SevaBooking = require("../models/sevaBooking.model");
const {
  isNullOrUndefined,
  isDateInPresentOrFuture,
  generateUniqueBookingId,
  isValidDateDDMMYYYYFormat,
  convertStringToObjectId,
} = require("../utils/index");
const { logger } = require("../../app/middlewares");

const createBookings = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(
      req.body.userId || !isValidDateDDMMYYYYFormat(req.body.bookingDate)
    )
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  //TODO:: validate booking types
  const user = await User.findOne({ _id: req.body.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!isDateInPresentOrFuture(req.body.bookingDate)) {
    const data = { success: false, message: "invalid booking date" };
    return { data, status: 400 };
  }

  if (!convertStringToObjectId(req.body.userId).equals(user._id)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 404 };
  }

  const bookingId = generateUniqueBookingId();
  const bookingData = {
    userId: user._id,
    bookingId: bookingId,
    name: req.body.name,
    NoOfPerson:req.body.NoOfPerson,
    category: req.body.category,
    amount: req.body.amount,
    comments: req.body.comments,
    bookingDate: req.body.bookingDate,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new Booking(bookingData).save();

  const data = {
    success: true,
    message: "Customer booking details saved successfully",
  };

  return { data, status: 200 };
};

const getSevaList = async () => {
  const bookings = await SevaBooking.find({});

  if (!bookings) {
    const data = {
      success: false,
      message: "Seva details doesn't exist",
    };
    return { data, status: 404 };
  } else {
    const data = { success: true, bookings };
    return { data, status: 200 };
  }
};

module.exports = {
  createBookings,
  getSevaList,
};