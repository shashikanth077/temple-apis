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
const { PUBLIC_URL } = require("../../utils/constants");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require("../../utils/sendEmail");
const AdminTranscationModel = require("../../models/admin/adminTranscationModel");

const getAllEvents = async () => {
  const events = await Event.find({ deleted: false });
  return { success: true, events, count: events.length };
};

const getEventById = async (req) => {
  const event = await Event.findOne({ _id: req.params.id });
  return { success: true, event };
};

const addEvents = async (req) => {
  const event = req.body;

  if (event.length < 1) {
    return { success: false, message: "No event found" };
  }

  const imagePath = PUBLIC_URL + "uploads/events/" + req.file.filename;
  req.body.image = imagePath;

  await new Event({
    name: event.name,
    bookingPrice: event.bookingPrice,
    organizer: event.organizer,
    organizerPhone: event.organizerPhone,
    organizerEmail: event.organizerEmail,
    startDate: event.startDate,
    endDate: event.endDate,
    venue: event.venue,
    image: event.image,
    description: event.description,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }).save();

  return { success: true, message: "Events added successfully" };
};

const getEventsByDateFilter = async (req) => {
  if (!req || !req?.startDate || !req?.endDate) {
    return { success: false, message: "Bad Request" };
  }

  const stDate = convertToDate(req.startDate); 
  const endDate = convertToDate(req.endDate); 

  const events = await Event.find({
    deleted: false,
    $and: [
      { startDate: { $gte: stDate.toLocaleDateString() } },
      { endDate: { $lte: endDate.toLocaleDateString() } },
    ],
  });

  return { events, count: events.length };
};

const updateEvent = async (req) => {
  const existingEvent = await Event.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!existingEvent) {
    return { success: false, message: "Event doesn't exists" };
  }

  if (isNullOrUndefined(req.file?.filename)) {
    req.body.image = existingEvent.image;
  } else {
    const imagePath = PUBLIC_URL + "uploads/events/" + req?.file?.filename;
    req.body.image = imagePath;
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { runValidators: true, new: true }
  );

  return { success: true, message: "Event updated successfully", event };
};

const convertToDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(year, month - 1, day);
};

const deleteEvent = async (req) => {
  const existingEvent = await Event.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!existingEvent) {
    return { success: false, message: "Event doesn't exists" };
  }

  const event = await Event.findByIdAndUpdate(req.params.id, {
    $set: { deleted: true },
    modifiedAt: Date.now(),
  });

  return { success: true, message: "Event deleted successfully", event };
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
  let serviceBookId = serviceShortName + "_" + req.body.devoteeId + "/" + generateUniqueNumber();
  const messageText = `Hello ${req.body.devoteeName}. ${message}. Booking Id:${serviceBookId}`;
  sendSMS(toPhoneNumber, messageText);

  let EmailObject = {
    name: req.body.devoteeName,
    email: req.body.devoteeEmail,
    message: message,
    bodyData: req.body,
    url: "http://localhost:3000/mybookings/list",
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
  getAllEvents,
  getEventById,
  addEvents,
  getEventsByDateFilter,
  updateEvent,
  deleteEvent,
  createBookings,
};
