const { logger } = require("../../middlewares");

const {
  getAllServices,
  getServicesByGodId,
  addServiceDetails,
  updateServiceDetailsByGodId,
  inactivateServiceByServiceId,
  inactivateServiceByGodId,
  getServiceByServiceId,
  createBookings,
} = require("../../services/admin/servicesBookingService");

exports.getAllServicesController = async (req, res, next) => {
  try {
    const gods = await getAllServices();
    return res.status(200).json(gods);
  } catch (error) {
    logger.error("getAllServices Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error (getAllServices)",
    });
  }
};

exports.getServiceByServiceIdController = async (req, res) => {
  try {
    const serviceResult = await getServiceByServiceId(req.params._id);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("getServiceByServiceId Error:", error);
    res.status(500).json({
      error: "Internal server error (getServiceByServiceIdController)",
    });
  }
};

exports.getServicesByGodIdController = async (req, res) => {
  try {
    const serviceResult = await getServicesByGodId(req.params.godId);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("getServicesByGodIdService Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getServicesByGodIdController)" });
  }
};

exports.addServiceDetailsController = async (req, res, next) => {
  try {
    const serviceResult = await addServiceDetails(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("addServiceDetailsController Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error (addServiceDetails)",
    });
  }
};

exports.getGodDetailsByIdController = async (req, res) => {
  try {
    const serviceResult = await getGodDetailsById(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("getGodDetailsByIdController Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (getGodDetailsById)",
    });
  }
};

exports.updateServiceDetailsController = async (req, res) => {
  try {
    const serviceResult = await updateServiceDetailsByGodId(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("updateGodDetails Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (updateGodDetails)",
    });
  }
};

exports.inActivateServiceByServiceIdController = async (req, res) => {
  try {
    const serviceResult = await inactivateServiceByServiceId(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("deleteGodDetails Error:", error);
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (inActivateServiceByServiceIdController)",
    });
  }
};

exports.inActivateServiceByGodIdController = async (req, res) => {
  try {
    const serviceResult = await inactivateServiceByGodId(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error("deleteGodDetails Error:", error);
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (inActivateServiceByGodIdController)",
    });
  }
};

exports.createServiceBookController = async (req, res) => {
  try {
    const result = await createBookings(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("createBookingsController Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error (createServiceBookController)",
    });
  }
};
