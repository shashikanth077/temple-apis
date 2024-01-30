const { logger } = require("../middlewares");
const {
    createVolunteers,
    getVolunteers
} = require("../services/volunteers.service");

exports.createVolunteersController = async (req, res) => {
  try {
    const result = await createVolunteers(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    //logger.error('createVolunteersController Error:', error);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal server error (createVolunteersController)",
      });
  }
};


exports.getVolunteersController = async (req, res) => {
    try {
      const volunteerResult = await getVolunteers(req);
      return res.status(volunteerResult.status).json(volunteerResult.data);
    } catch (error) {
        console.log(error);
      res
        .status(500)
        .json({
          success: false,
          error:
            "Something went wrong please try again (getVolunteers)",
        });
    }
  };
