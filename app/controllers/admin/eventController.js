const { logger } = require("../../middlewares");

const {
  getAllEvents,
  addEvents,
  getEventById,
  getEventsByDateFilter,
  updateEvent,
  deleteEvent,
  createBookings,
} = require("../../services/admin/eventService");

exports.getAllEventsController = async (req, res, next) => {
  try {
    const getAllEventService = await getAllEvents();
    return res.status(200).json(getAllEventService);
  } catch (error) {
    logger.error("getAllEventService Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getAllEventService)" });
  }
};

exports.getEventByIdController = async (req, res, next) => {
  try {
    const event = await getEventById(req);
    return res.status(200).json(event);
  } catch (error) {
    logger.error("getEventById Error:", error);
    res.status(500).json({ error: "Internal server error (getEventById)" });
  }
};

exports.getEventsByFilterController = async (req, res, next) => {
  try {
    const events = await getEventsByDateFilter(req.body);
    return res.status(200).json(events);
  } catch (error) {
    logger.error("getEventsByDateFilter Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getEventsByDateFilter)" });
  }
};

exports.addEventsController = async (req, res, next) => {
  try {
    const events = await addEvents(req);
    return res.status(200).json(events);
  } catch (error) {
    logger.error("addEventsController Error:", error);
    res.status(500).json({ error: "Internal server error (addEvents)" });
  }
};

exports.updateEventController = async (req, res) => {
  try {
    const event = await updateEvent(req);
    return res.status(200).json(event);
  } catch (error) {
    logger.error("updateProduct Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong please try again (updateEvent)" });
  }
};

exports.deleteEventController = async (req, res) => {
  try {
    const event = await deleteEvent(req);
    return res.status(200).json(event);
  } catch (error) {
    logger.error("deleteProduct Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong please try again (deleteEvent)" });
  }
};

exports.bookEventController = async (req, res) => {
  try {
    const event = await createBookings(req);
    return res.status(event.status).json(event.data);
  } catch (error) {
    logger.error("deleteProduct Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (bookEventController)",
    });
  }
};
