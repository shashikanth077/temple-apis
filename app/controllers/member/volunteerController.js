const { logger } = require("../../middlewares");
const {
  createVolunteers,
  getVolunteers,
  updateVolunteer,
} = require("../../services/member/volunteerService");
const Email = require("../../utils/sendEmail");

exports.createVolunteersController = async (req, res) => {
  try {
    const result = await createVolunteers(req);
    return res.status(result.status).json(result.data);
  } catch (message) {
    logger.error("createVolunteersController Error:", error);
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (getVolunteers)",
    });
  }
};

exports.updateVolunteerStatusController = async (req, res) => {
  try {
    const volunteerResult = await updateVolunteer(req);

    if (volunteerResult?.data.volunteer?.approveStatus == "approved") {
      let VolunterObj = {
        name: volunteerResult?.data.volunteer.name,
        email: volunteerResult?.data.volunteer.email,
      };

      SendApprovEmail(VolunterObj, "");
    }

    return res.status(volunteerResult.status).json(volunteerResult.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error:
        "Something went wrong please try again (updateVolunteerStatusController)",
    });
  }
};

const SendApprovEmail = async (user, activationLink) => {
  new Email(
    user,
    activationLink,
    "volunteer approval",
    (type = "volapprove")
  ).volunteerApprove();
};
