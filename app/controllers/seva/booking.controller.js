const { logger } = require("../../middlewares");

const {
  createBookings,
  getSevaList
} = require("../../services/booking.service");

exports.createBookingsController = async (req, res) => {
  try {
    const result = await createBookings(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    //logger.error('createBookingsController Error:', error);
    console.log(message);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal server error (createBookings)",
      });
  }
};

exports.getSevaList = async (req, res) => {
    try {
      const serviceResult = await getSevaList(req);
      return res.status(serviceResult.status).json(serviceResult.data);
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error:
            "Something went wrong please try again (getSevaList)",
        });
    }
  };
