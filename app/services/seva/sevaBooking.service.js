const SevaBooking = require("../../models/seva/sevaBooking.model");
const { allowedSevaTypes } = require("../../utils/constants");
const { isNullOrUndefined } = require("../../utils");
const { logger } = require("../../middlewares");
const {PUBLIC_URL} = require("../../utils/constants");

const addSevaBookingDetails = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  // TODO:: update validation
  //   const isSevaBookingTypes =
  //     req &&
  //     req.body &&
  //     !isNullOrUndefined(req.body.sevaBookingType) &&
  //     allowedSevaBookingTypes.includes(req.body.sevaBookingType);

  //   if (!isSevaBookingTypes) {
  //     const data = { success: false, message: "invalid sevaBookingType in request" };
  //     return { data, status: 400 };
  //   }

  const imagePath = PUBLIC_URL + "uploads/seva/" + req.file.filename;
 
  const sevaBookingData = {
    sevaBookingType: req.body.sevaBookingType,
    name: req.body.name,
    category: req.body.category,
    amount: req.body.amount,
    availableSlot: req.body.availableSlot,
    description: req.body.description,
    image: imagePath,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new SevaBooking(sevaBookingData).save();

  const data = {
    success: true,
    message: "sevaBooking details added successfully",
  };

  return { data, status: 200 };
};

const getSevaBookingDetailsByBookingType = async (req) => {
  let bookings;
  if (req.body && req.body.sevaBookingType) {
    bookings = await SevaBooking.find({
      sevaBookingType: req.body.sevaBookingType,
    });
  } else {
    bookings = await SevaBooking.find({});
  }

  if (!bookings) {
    const data = {
      success: true,
      message: "Seva booking details doesn't exist",
    };
    return { data, status: 404 };
  } else {
    const data = { success: true, bookings };
    return { data, status: 200 };
  }
};

const updateSevaBookingDetails = async (req) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.params.id)
  ) {
    const data = { success: false, message: "invalid request" };

    return { data, status: 400 };
  }

  const existingSevaBooking = await SevaBooking.findOne({ _id: req.params.id });

  if (!existingSevaBooking) {
    const data = {
      success: false,
      message: "Seva booking details doesn't exist",
    };
    return { data, status: 404 };
  }
  
  if (isNullOrUndefined(req.file?.filename)) {
    req.body.image = existingSevaBooking.image;
  } else {
    const imagePath = PUBLIC_URL + "uploads/seva/" + req?.file?.filename;
    req.body.image = imagePath;
  }

  const result = await SevaBooking.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "Seva booking details updated successfully",
    result,
  };

  return { data, status: 200 };
};

const deleteSevaBookingDetails = async (req) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.params.id)) {
    const data = { success: false, message: "invalid request" };

    return { data, status: 400 };
  }

  const existingSevaBooking = await SevaBooking.findOne({ _id: req.params.id });

  if (!existingSevaBooking) {
    const data = {
      success: false,
      message: "Seva booking details doesn't exist",
    };
    return { data, status: 404 };
  }

  await SevaBooking.deleteOne({ _id: req.params.id });
  const data = {
    success: true,
    message: "Seva booking details deleted successfully",
  };

  return { data, status: 200 };
};

const getSevaBookingDetailsById = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.params.id)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }
  const booking = await SevaBooking.findOne({ _id: req.params.id });

  if (!booking) {
    const data = { success: false, message: "Seva booking details not found" };
    return { data, status: 404 };
  }

  const data = { success: true, booking};

  return { data, status: 200 };
};

module.exports = {
  addSevaBookingDetails,
  getSevaBookingDetailsByBookingType,
  updateSevaBookingDetails,
  deleteSevaBookingDetails,
  getSevaBookingDetailsById,
};
