const User = require("../../models/auth/userModel");
const SevaHistory = require("../../models/member/bookingHistory/sevaHistoryModel");
const SevaBooking = require("../../models/member/sevaModel");
const { CLIENT_URL } = require("../../utils/constants");
const SevaAdminModel = require("../../models/admin/sevaModel");

const {
  isNullOrUndefined,
  isDateInPresentOrFuture,
  isValidDateDDMMYYYYFormat,
  convertStringToObjectId,
  generateUniqueNumber,
} = require("../../utils/index");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require("../../utils/sendEmail");
const { logger } = require("../../middlewares");
const AdminTranscationModel = require("../../models/admin/adminTranscationModel");

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

  let message;
  if (req.body.transStatus === "succeeded") {
    message =
      "Payment was successfull. Thank you for booking " + req.body.sevaName;
  } else {
    message =
      "Payment was unsuccessfull. If amount debited it will refund to same account withing 3 to 4 days";
  }

  const serviceShortName = "sev";
  let serviceBookId =
    serviceShortName + "_" + req.body.devoteeId + "/" + generateUniqueNumber();
  const messageText = `Hello ${req.body.devoteeName}. ${message}. Booking Id:${serviceBookId}`;
  sendSMS(req.body.devoteePhoneNumber, messageText);

  let EmailObject = {
    name: req.body.devoteeName,
    email: req.body.devoteeEmail,
    message: message,
    bodyData: req.body,
    url: `${CLIENT_URL}/mybookings/list`,
  };
  SendConfirmationEmail(EmailObject, "");

  const SevaData = {
    userId: user._id,
    sevaBookId: serviceBookId,
    orderType: req.body.orderType,
    sevaType: req.body.sevaType,
    devoteeName: req.body.devoteeName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.devoteeEmail,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    orderNotes: req.body.orderNotes,
    NoOfPerson: req.body.NoOfPerson,
    poojaTime: req.body.poojaTime,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.amount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    paymentMethod: req.body.paymentMethod,
    sevaName: req.body.sevaName,
    NoOfPerson: req.body.NoOfPerson,
    bookingDate: req.body.bookingDate,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  const sevaHistory = new SevaHistory(SevaData);
  const savedSeva = await sevaHistory.save();
  const lastInsertedId = savedSeva._id;

  const adminTransData = {
    userId: user._id,
    tabelRefId: lastInsertedId,
    orderType: "sevas",
    serviceName: req.body.sevaName,
    devoteeName: req.body.devoteeName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.devoteeEmail,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    orderNotes: req.body.orderNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.amount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    ticketId: serviceBookId,
    items: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await AdminTranscationModel.create(adminTransData);

  const data = {
    success: true,
    message: "SevaData details added successfully",
  };

  return { data, status: 200 };
};

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(user, activationLink, "seva booking email").sevaConfirmation();
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

const getSevaBookingDetailsByBookingType = async (req) => {
  let bookings;
  if (req.body && req.body.sevaBookingType) {
    bookings = await SevaBooking.find({
      sevaBookingType: req.body.sevaBookingType,
    });
  } else {
    bookings = await SevaAdminModel.find({});
  }

  if (!bookings) {
    const data = {
      success: true,
      message: "Seva booking details doesn't exist",
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
  getSevaBookingDetailsByBookingType
};
