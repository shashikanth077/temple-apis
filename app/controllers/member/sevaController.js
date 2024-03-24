const { logger } = require("../../middlewares");

const {
  createBookings,
  getSevaList,
  getSevaBookingDetailsByBookingType
} = require("../../services/member/sevaService");

exports.createBookingsController = async (req, res) => {
  try {
    const result = await createBookings(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("createBookingsController Error:", error);
    res.status(500).json({
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
    logger.error("getSevaList Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (getSevaList)",
    });
  }
};


exports.getSevaListController = async (req, res) => {
  try {
    const serviceResult = await getSevaBookingDetailsByBookingType(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (getSevaBookingDetailsController)",
    });
  }
};
