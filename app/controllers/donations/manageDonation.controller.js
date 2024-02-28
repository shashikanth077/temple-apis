const { logger } = require("../../middlewares");

const {
  addDonationType,
  getDonationTypesByFrequency,
  updateDonationTypeDetails,
  deleteDonationTypeDetails,
  getDonationTypeDetailsById,
  getDonationTypeDetailsByType
} = require("../../services/donations/manageDonation.service");

exports.addDonationTypeController = async (req, res) => {
  try {
    const result = await addDonationType(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    logger.error('addDonationType Error:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error (addDonationTypeController)",
    });
  }
};

exports.getDonationTypesByFrequencyController = async (req, res) => {
  try {
    const serviceResult = await getDonationTypesByFrequency(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error('getDonationTypesByFrequencyController Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Something went wrong please try again (getDonationTypesByFrequency)",
      });
  }
};

exports.updateDonationTypeDetailsController = async (req, res) => {
  try {
    const serviceResult = await updateDonationTypeDetails(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error('updateDonationTypeDetailsController Error:', error);
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Something went wrong please try again (updateDonationTypeDetails)",
      });
  }
};

exports.deleteDonationTypeDetailsController = async (req, res) => {
  try {
    const serviceResult = await deleteDonationTypeDetails(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error('deleteDonationTypeDetails Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Something went wrong please try again (deleteDonationTypeDetails)",
      });
  }
};

exports.getDonationTypeDetailsByIdController = async (req, res) => {
  try {
    const serviceResult = await getDonationTypeDetailsById(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error('getDonationTypeDetailsByIdController Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Something went wrong please try again (getDonationTypeDetailsById)",
      });
  }
};

exports.getDonationTypeDetailsByTypeController = async (req, res) => {
  try {
    const serviceResult = await getDonationTypeDetailsByType(req);
    return res.status(serviceResult.status).json(serviceResult.data);
  } catch (error) {
    logger.error('getDonationTypeDetailsByTypeController Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Something went wrong please try again (getDonationTypeDetailsByTypeController)",
      });
  }
};
