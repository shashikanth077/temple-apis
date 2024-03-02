const { logger } = require("../../middlewares");

const {
  addSevaBookingDetails,
  getSevaBookingDetailsByBookingType,
  updateSevaBookingDetails,
  deleteSevaBookingDetails,
  getSevaBookingDetailsById,
} = require("../../services/admin/sevaService");

exports.addSevaBookingDetailsController = async (req, res) => {
  try {
    const result = await addSevaBookingDetails(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    logger.error("addSevaBookingDetails Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error (addSevaBookingDetails)",
    });
  }
};

exports.getSevaBookingDetailsController = async (req, res) => {
  try {
    const serviceResult = await getSevaBookingDetailsByBookingType(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (getSevaBookingDetailsByBookingType)",
    });
  }
};

exports.updateSevaBookingDetailsController = async (req, res) => {
  try {
    const serviceResult = await updateSevaBookingDetails(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("updateSevaBooking Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (updateSevaBookingDetails)",
    });
  }
};

exports.deleteSevaBookingDetailsController = async (req, res) => {
  try {
    const serviceResult = await deleteSevaBookingDetails(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("deleteSevaBooking Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (deleteSevaBookingDetails)",
    });
  }
};

exports.getSevaBookingDetailsByIdController = async (req, res) => {
  try {
    const serviceResult = await getSevaBookingDetailsById(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (getSevaBookingDetailsById)",
    });
  }
};
