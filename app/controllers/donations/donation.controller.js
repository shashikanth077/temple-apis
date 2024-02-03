const { logger } = require("../../middlewares");

const {
  addDonationDetails,
  getDonationDetailsByUserId,
  getDonationDetailsByDonationId,
} = require("../../services/donations/donation.service");

exports.getDonationDetailsByUserId = async (req, res) => {
  try {
    const result = await getDonationDetailsByUserId(req);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("getDonationDetailsByUserId Error:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal server error (getDonationDetailsByUserId)",
      });
  }
};

exports.getDonationDetailsByDonationId = async (req, res) => {
  try {
    const result = await getDonationDetailsByDonationId(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("getDonationDetailsByUserId Error:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal server error (getDonationDetailsByUserId)",
      });
  }
};

exports.addDonationDetailsController = async (req, res) => {
  try {
    const result = await addDonationDetails(req);

    return res.status(result.status).json(result.data);
  } catch (message) {
    //logger.error('addDonationController Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal server error (addDonationDetails)",
      });
  }
};
