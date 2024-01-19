const { logger } = require("../middlewares");

const {
  getFamilyDetailsByUserId,
  createFamilyDetails,
  updateFamilyDetails,
  deleteFamilyDetails,
  getFamilyListByUserId
} = require("../services/familyDetails.service");

exports.getFamilyDetailsByUserId = async (req, res) => {
  try {
    const family = await getFamilyDetailsByUserId(req);
    return res.status(family.status).json(family.data);
  } catch (error) {
    logger.error("getFamilyDetailsService Error:", error);
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error (getFamilyDetailsService)" });
  }
};

exports.getFamilyListByUserId = async (req, res) => {
  try {
    const family = await getFamilyListByUserId(req);
    return res.status(family.status).json(family.data);
  } catch (error) {
    logger.error("getFamilyListByUserId Error:", error);
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error (getFamilyListByUserId)" });
  }
};

exports.createFamilyDetailsController = async (req, res) => {
  try {
    const result = await createFamilyDetails(req);

    return res.status(result.status).json(result.data);
  } catch (message) {
    //logger.error('FamilyDetailsController Error:', error);
    res
      .status(500)
      .json({ message: "Internal server error (createFamilyDetails)" });
  }
};

exports.updateFamilyDetailsController = async (req, res) => {
  try {
    const result = await updateFamilyDetails(req);

    return res.status(result.status).json(result.data);
  } catch (error) {
    //logger.error('updateFamilyDetails Error:', error);
    res.status(500).json({
      error: "Something went wrong please try again (updateFamilyDetails)",
    });
  }
};

exports.deleteFamilyDetailsController = async (req, res) => {
  try {
    const result = await deleteFamilyDetails(req);

    return res.status(result.status).json(result.data);
  } catch (error) {
    //logger.error('deleteFamilyDetails Error:', error);
    res.status(500).json({
      error: "Something went wrong please try again (deleteFamilyDetails)",
    });
  }
};
