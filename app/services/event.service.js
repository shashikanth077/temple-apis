const validator = require("validator");
const Event = require("../models/event.model");
const { logger } = require("../../app/middlewares");
const { isValidDateDDMMYYYYFormat } = require("../utils/index");
const { PUBLIC_URL } = require("../utils/constants")

const getAllEvents = async () => {
  const events = await Event.find({ deleted: false });
  return {success:true, events,count: events.length };
};

const getEventById = async (req) => {
  const event = await Event.findOne({ _id: req.params.id });
  return {success:true,event };
};

const addEvents = async (req) => {
  const event = req.body;

  if (event.length < 1) {
    return { success: false, message: "No event found" };
  }

  // const hasInvalidEvent = eventsArray.some(
  //   (event) => {

  //     console.log(event);
  //       const imagePath = PUBLIC_URL+'uploads/products/'+req.file.filename;
  //       req.body.image = imagePath;
  
  //       !validator.isEmail(event.organizerEmail) ||
  //       !event.name ||
  //       !event.bookingPrice ||
  //       !event.organizer ||
  //       !event.organizerPhone ||
  //       !isValidDateDDMMYYYYFormat(event.startDate) ||
  //       !isValidDateDDMMYYYYFormat(event.endDate) ||
  //       !event.venue ||
  //       !event.image ||
  //       !event.description
  //   }
  // );

  // if (hasInvalidEvent) {
  //   return { success: false, message: "Bad Request" };
  // }

  const imagePath = PUBLIC_URL+'uploads/events/'+req.file.filename;
  req.body.image = imagePath;

  // await Promise.all(
    // eventsArray.map(async (event, index) => {
      await new Event({
        name: event.name,
        bookingPrice: event.bookingPrice,
        organizer: event.organizer,
        organizerPhone: event.organizerPhone,
        orgEmail: event.organizerEmail,
        startDate: event.startDate,
        endDate: event.endDate,
        venue: event.venue,
        image: event.image,
        description: event.description,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      }).save();
    // })
  // );

  return { success: true, message: "Events added successfully" };
};

const getEventsByDateFilter = async (req) => {
  if (!req || !req?.startDate || !req?.endDate) {
    return { success: false, message: "Bad Request" };
  }

  const stDate = convertToDate(req.startDate); // dd-mm-yyyy
  const endDate = convertToDate(req.endDate); // dd-mm-yyyy

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

module.exports = {
  getAllEvents,
  getEventById,
  addEvents,
  getEventsByDateFilter,
  updateEvent,
  deleteEvent,
};
