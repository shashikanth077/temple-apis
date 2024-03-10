const User = require("../../models/auth/userModel");
const Event = require("../../models/admin/eventModel");
const eventHistory = require("../../models/member/bookingHistory/eventHistoryModel");
const {
  isNullOrUndefined,
  isDateInPresentOrFuture,
  isValidDateDDMMYYYYFormat,
  convertStringToObjectId,
  generateUniqueNumber,
} = require("../../utils");
const { CLIENT_URL } = require("../../utils/constants");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require("../../utils/sendEmail");
const AdminTranscationModel = require("../../models/admin/adminTranscationModel");

function convertDateForEventFilter(type) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentDateString = currentDate.toDateString();

  if (type === "upcoming") {
    //if its upcoming events
    let currentDate = new Date();

    // Convert current date to a string in the format "Sat Mar 30 2024"
    const currentDateString = currentDate.toDateString();

    // Construct start and end dates with only day, month, and year components
    const startDateFilter = new Date(`${currentDateString.slice(4)} ${currentYear}`);
    const futureDateFilter = new Date(startDateFilter);
    futureDateFilter.setFullYear(futureDateFilter.getFullYear() + 1);

    return { startDate: startDateFilter, endDate: futureDateFilter };
  } else if (type === "recent") {
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const startDate = new Date(todayDate);
    startDate.setDate(todayDate.getDate() - 1);

    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() - 1);

    return { startDate: startDate, endDate: endDate };
  } else if (type === "daily") {
    let currentDate = new Date();

    // Set the time to the beginning of today (00:00:00)
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the start date (beginning of the current date)
    let startDate = new Date(currentDate);

    // Calculate the end date (end of the current date)
    let endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999); // Set time to end of the day
    return { startDate: startDate, endDate: endDate };
  }
}

const getEventsByDateFilter = async (req) => {

  if (!req) {
    return { success: false, message: "Bad Request" };
  }

  const dateDailyFilterObj = convertDateForEventFilter("daily");
  const dailyEvents = await Event.find({
    deleted: false,
    $and: [
      {
        startDate: { $gte: dateDailyFilterObj.startDate },
        endDate: { $lt: dateDailyFilterObj.endDate },
      },
    ],
  });

  const dateRecentFilterObj = convertDateForEventFilter("recent");
  const recentEvents = await Event.find({
    deleted: false,
    $and: [
      {
        startDate: { $gte: dateRecentFilterObj.startDate },
        endDate: { $lt: dateRecentFilterObj.endDate },
      },
    ],
  });

  const dateFutureFilterObj = convertDateForEventFilter("upcoming");
  const futureEvents = await Event.find({
    deleted: false,
    $and: [
      {
        startDate: { $gt: dateFutureFilterObj.startDate },
        endDate: { $lte: dateFutureFilterObj.endDate },
      },
    ],
  });

  return { 
    success: true, 
    events:{
      futureevents:futureEvents, 
      recentevents:recentEvents,
      dailyevents:dailyEvents, 
    }
  };
};

const createBookings = async (req) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.body.userId)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.body.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!convertStringToObjectId(req.body.userId).equals(user._id)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 404 };
  }

  //send email and sms success or failur
  const toPhoneNumber = "+918123192799"; // Replace with the recipient's phone number

  let message;
  if (req.body.transStatus === "succeeded") {
    message =
      "Payment was successfull. Thank you for booking " + req.body.eventName;
  } else {
    message =
      "Payment was unsuccessfull. If amount debited it will refund to same account withing 3 to 4 days";
  }

  const serviceShortName = "EVT";
  let serviceBookId =
    serviceShortName + "_" + req.body.devoteeId + "/" + generateUniqueNumber();
  const messageText = `Hello ${req.body.devoteeName}. ${message}. Booking Id:${serviceBookId}`;
  sendSMS(toPhoneNumber, messageText);

  let EmailObject = {
    name: req.body.devoteeName,
    email: req.body.devoteeEmail,
    message: message,
    bodyData: req.body,
    url: `${CLIENT_URL}/mybookings/list`,
  };

  SendConfirmationEmail(EmailObject, "");

  const eventData = {
    userId: user._id,
    eventBookId: serviceBookId,
    orderType: req.body.orderType,
    venue: req.body.venue,
    eventId: req.body.eventId,
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
    paymentMethod: req.body.paymentMethod,
    eventName: req.body.eventName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    organizer: req.body.organizer,
    organizerPhone: req.body.organizerPhone,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  const serHistory = new eventHistory(eventData);
  const savedService = await serHistory.save();
  const lastInsertedId = savedService._id;

  const adminTransData = {
    userId: user._id,
    tabelRefId: lastInsertedId,
    orderType: "events",
    serviceName: req.body.eventName,
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
    message: "eventData details added successfully",
  };

  return { data, status: 200 };
};

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(user, activationLink, "event booking email").eventConfirmation();
};

module.exports = {
  getEventsByDateFilter,
  createBookings,
};
