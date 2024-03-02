const { logger } = require("../../middlewares");

const {
  getDeceasedDetailsByUserId,
  createDeceasedDetails,
  updateDeceasedDetails,
  deleteDeceasedDetails,
  getDeceasedListByUserId,
} = require("../../services/member/userProfile/deceasedDetailsService");

exports.getDeceasedDetailsByUserId = async (req, res) => {
  try {
    const Deceased = await getDeceasedDetailsByUserId(req);
    return res.status(Deceased.status).json(Deceased.data);
  } catch (error) {
    logger.error("getDeceasedDetailsService Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getDeceasedDetailsService)" });
  }
};

exports.getDeceasedListByUserId = async (req, res) => {
  try {
    const Deceased = await getDeceasedListByUserId(req);
    return res.status(Deceased.status).json(Deceased.data);
  } catch (error) {
    logger.error("getDeceasedListByUserId Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getDeceasedListByUserId)" });
  }
};

exports.createDeceasedDetailsController = async (req, res) => {
  try {
    const result = await createDeceasedDetails(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("DeceasedDetailsController Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error (createDeceasedDetails)" });
  }
};

exports.updateDeceasedDetailsController = async (req, res) => {
  try {
    const result = await updateDeceasedDetails(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("updateDeceasedDetails Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (updateDeceasedDetails)",
    });
  }
};

exports.deleteDeceasedDetailsController = async (req, res) => {
  try {
    const result = await deleteDeceasedDetails(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("deleteDeceasedDetails Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (deleteDeceasedDetails)",
    });
  }
};
