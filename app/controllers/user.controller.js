const { logger } = require("../middlewares");

const {
  getAllUsers,
  getUserByUserId,
  updateUserRole,
  activateOrDeActivateUserByUserId,
} = require("../services/user.service");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    return res.status(result.status).json(result.data);
  } catch (error) {
    //logger.error("getAllUsers Error:", error);
    res.status(500).json({ error: "Internal server error (getAllUsers)" });
  }
};

exports.getUserByUserId = async (req, res) => {
  try {
    const result = await getUserByUserId(req.params.userId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    //logger.error("getUserByUserId Error:", error);
    res.status(500).json({ error: "Internal server error (getUserByUserId)" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const result = await updateUserRole(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
    //logger.error('updateUserRole Error:', error);
    res.status(500).json({
      error: "Something went wrong please try again (updateUserRole)",
    });
  }
};

exports.activateOrDeActivateUserByUserId = async (req, res) => {
  try {
    const result = await activateOrDeActivateUserByUserId(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    //logger.error('activateOrDeActivateUserByUserId Error:', error);
    res.status(500).json({
      error:
        "Something went wrong please try again (activateOrDeActivateUserByUserId)",
    });
  }
};
