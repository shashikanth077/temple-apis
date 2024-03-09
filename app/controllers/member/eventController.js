const { logger } = require("../../middlewares");

const {
  getEventsByDateFilter,
  createBookings,
} = require("../../services/member/eventService");

exports.getEventsByFilterController = async (req, res, next) => {
  try {
    const events = await getEventsByDateFilter(req);
    return res.status(200).json(events);
  } catch (error) {
    logger.error("getEventsByDateFilter Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getEventsByDateFilter)" });
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
