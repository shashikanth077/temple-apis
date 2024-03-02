const { logger } = require("../../middlewares");

const {
  getUserProfileByUserId,
  createUserProfile,
  updateUserProfile,
  deleteUserAndProfile,
} = require("../../services/member/userProfile/userProfileService");

exports.getUserProfileByUserId = async (req, res) => {
  try {
    const profile = await getUserProfileByUserId(req.params.userId);
    return res.status(profile.status).json(profile.data);
  } catch (error) {
    logger.error("getUserProfilesService Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error (getUserProfilesService)" });
  }
};

exports.createUserProfileController = async (req, res) => {
  try {
    const result = await createUserProfile(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    logger.error("createUserProfileController Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error (createUserProfile)" });
  }
};

exports.updateUserProfileController = async (req, res) => {
  try {
    const result = await updateUserProfile(req);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("updateProduct Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (updateUserProfile)",
    });
  }
};

exports.deleteUserProfileController = async (req, res) => {
  try {
    const result = await deleteUserAndProfile(req);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("updateProduct Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (deleteUserProfile)",
    });
  }
};
