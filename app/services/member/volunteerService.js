const Volunteers = require("../../models/member/volunteerModel");
const { isNullOrUndefined } = require("../../utils/index");

const createVolunteers = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  req.body.approveStatus = null;
  const VolunteerData = {
    ...req.body,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new Volunteers(VolunteerData).save();

  const data = {
    success: true,
    message: "Volunteers details saved successfully",
  };

  return { data, status: 200 };
};

const getVolunteers = async () => {
  const volunteers = await Volunteers.find({});

  if (!volunteers) {
    const data = {
      success: false,
      message: "Volunteers details doesn't exist",
    };
    return { data, status: 404 };
  } else {
    const data = { success: true, volunteers };
    return { data, status: 200 };
  }
};

const updateVolunteer = async (req) => {
  const existingVolunteer = await Volunteers.findOne({ _id: req.body._id });

  if (!existingVolunteer) {
    const data = { success: false, message: "Volunteer doesn't exist" };
    return { data, status: 404 };
  }

  const newStatus = req.body.status;

  const volunteer = await Volunteers.findByIdAndUpdate(
    req.body._id,
    { $set: { approveStatus: newStatus } },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "Volunteer updated successfully",
    volunteer,
  };
  return { data, status: 200 };
};

module.exports = {
  createVolunteers,
  getVolunteers,
  updateVolunteer,
};
