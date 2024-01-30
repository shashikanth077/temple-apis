const Volunteers = require("../models/volunteer.model");
const {
  isNullOrUndefined,
} = require("../utils/index");
const { logger } = require("../../app/middlewares");

const createVolunteers = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

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

module.exports = {
  createVolunteers,
  getVolunteers
};