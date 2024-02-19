const Service = require("../../models/services/service.model");
const God = require("../../models/god/god.model");
const User = require("../../models/user/user.model");
const ServiceHistory = require("../../models/bookingHistory/ServiceHistory.Model");
const { logger } = require("../../middlewares");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require('../../utils/sendEmail');
const AdminTranscationModel = require("../../models/bookingHistory/adminTranscation.model");
const {
  allowedBookingTypes,
  allowedServiceTypes,
} = require("../../utils/constants");
const {
  isNullOrUndefined,
  isDateInPresentOrFuture,
  isValidDateDDMMYYYYFormat,
  convertStringToObjectId,
  generateUniqueNumber
} = require("../../utils/index");
const {PUBLIC_URL} = require("../../utils/constants")

const getAllServices = async () => {
  const services = await Service.find({ deleted: false });

  return { success: true, services, count: services.length };
};

const getServicesByGodId = async (godId) => {
  const godDetails = await God.findOne({ _id: godId, deleted: false });

  if (!godDetails) {
    const data = { success: false, message: "God details not found" };
    return { data, status: 404 };
  }

  const services = await Service.find({ godId: godId, deleted: false });
  if (!services) {
    const data = { success: false, message: "Services not found" };
    return { data, status: 404 };
  }

  const data = { success: true, services };

  return { data, status: 200 };
};

const getServiceByServiceId = async (serviceId) => {
  const service = await Service.findOne({ _id: serviceId, deleted: false });

  if (!service) {
    const data = { success: false, message: "Service doesn't exist" };
    return { data, status: 404 };
  } else {
    const data = { success: true, service };
    return { data, status: 200 };
  }
};

const addServiceDetails = async (req) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  // validation for booking and service types
  const isValidServiceTypes =
    req &&
    req.body &&
    !isNullOrUndefined(req.body.serviceType) &&
    allowedServiceTypes.includes(req.body.serviceType);

  const isValidBookingTypes =
    req &&
    req.body &&
    !isNullOrUndefined(req.body.bookingType) &&
    allowedBookingTypes.includes(req.body.bookingType);

  if (!isValidServiceTypes || !isValidBookingTypes) {
    const data = {
      success: false,
      message: "invalid serviceType or bookingType request",
    };
    return { data, status: 400 };
  }

  const god = await God.findOne({ _id: req.params.godId, deleted: false });

  if (!god) {
    const data = { success: false, message: "God Details not found" };
    return { data, status: 404 };
  }

  const imagePath = PUBLIC_URL + "uploads/services/" + req.file.filename;
  req.body.image = imagePath;

  const serviceData = {
    godId: god._id,
    godName: god.name,
    ...req.body,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new Service(serviceData).save();

  const data = { success: true, message: "Service details added successfully" };

  return { data, status: 200 };
};

const updateServiceDetailsByGodId = async (req, res) => {
  const god = await God.findOne({ _id: req.params.godId, deleted: false });
  if (!god) {
    const data = { success: false, message: "God details not found" };
    return { data, status: 404 };
  }

  if (!req.params.serviceId) {
    const data = {
      success: false,
      message: "Service detail invalid for this God",
    };
    return { data, status: 404 };
  }

  const existingServiceId = await Service.findOne({
    _id: req.params.serviceId,
    deleted: false,
  });

  if (!existingServiceId || existingServiceId === null) {
    const data = {
      success: false,
      message: "Service details doesn't exists for this god",
    };
    return { data, status: 404 };
  }

  if (isNullOrUndefined(req.file?.filename)) {
    req.body.image = existingServiceId.image;
  } else {
    const imagePath = PUBLIC_URL + "uploads/services/" + req?.file?.filename;
    req.body.image = imagePath;
  }

  const serviceData = {
    ...req.body,
  };

  const serviceDetails = await Service.findByIdAndUpdate(
    req.params.serviceId,
    { $set: serviceData },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "Service details updated successfully",
    serviceDetails,
  };
  return { data, status: 200 };
};

const inactivateServiceByServiceId = async (req, res) => {
  if (!req.params.serviceId) {
    const data = {
      success: false,
      message: "Service detail invalid for this God",
    };
    return { data, status: 404 };
  }

  const existingServiceId = await Service.findOne({
    _id: req.params.serviceId,
    deleted: false,
  });

  if (!existingServiceId || existingServiceId === null) {
    const data = {
      success: false,
      message: "Service details doesn't exists",
    };
    return { data, status: 404 };
  }

  await Service.findByIdAndUpdate(
    req.params.serviceId,
    { $set: { deleted: true }, modifiedAt: Date.now() },
    { runValidators: true, new: true }
  );

  const data = {
    success: true,
    message: "Service details inactivated successfully",
  };

  return { data, status: 200 };
};

const inactivateServiceByGodId = async (req, res) => {
  const god = await God.findOne({ _id: req.params.godId, deleted: false });
  if (!god) {
    const data = { success: false, message: "God details not found" };
    return { data, status: 404 };
  }

  if (!req.params.godId) {
    const data = {
      success: false,
      message: "God details are invalid",
    };
    return { data, status: 404 };
  }

  const query = { godId: req.params.godId, deleted: false };

  await Service.updateMany(query, {
    $set: { deleted: true },
    modifiedAt: Date.now(),
  });
  const data = {
    success: true,
    message: "Service inactivated successfully for the god details",
  };

  return { data, status: 200 };
};

const createBookings = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(
      req.body.userId || !isValidDateDDMMYYYYFormat(req.body.bookingDate)
    )
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.body.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!isDateInPresentOrFuture(req.body.bookingDate)) {
    const data = { success: false, message: "invalid booking date" };
    return { data, status: 400 };
  }

  if (!convertStringToObjectId(req.body.userId).equals(user._id)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 404 };
  }

  //send email and sms success or failur
  const toPhoneNumber = "+918123192799"; // Replace with the recipient's phone number
    
  let message ;
  if(req.body.transStatus === 'succeeded') {
    message ='Payment was successfull. Thank you for booking '+req.body.ServiceName
  } else {
    message ='Payment was unsuccessfull. If amount debited it will refund to same account withing 3 to 4 days'
  }

  const serviceShortName = "SER"
  let serviceBookId = serviceShortName+'_'+req.body.devoteeId+'/'+generateUniqueNumber();
  const messageText = `Hello ${req.body.devoteeName}. ${message}. Booking Id:${serviceBookId}`;
  sendSMS(toPhoneNumber, messageText);

  let EmailObject = {
    name : req.body.devoteeName,
    email:req.body.devoteeEmail,
    message:message,
    bodyData:req.body,
    url:"http://localhost:3000/mybookings/list"
  }
  SendConfirmationEmail(EmailObject, '');

  const serviceData = {
    userId: user._id,
    ServiceBookId:serviceBookId,
    orderType: req.body.orderType,
    godName: req.body.godName,
    serviceType: req.body.serviceType,
    devoteeName: req.body.devoteeName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.devoteeEmail,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    orderNotes: req.body.orderNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.amount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    paymentMethod: req.body.paymentMethod,
    ServiceName: req.body.ServiceName,
    NoOfPerson: req.body.NoOfPerson,
    bookingDate: req.body.bookingDate,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  const serHistory = new ServiceHistory(serviceData);
  const savedService = await serHistory.save();
  const lastInsertedId = savedService._id;

  const adminTransData = {
    userId: user._id,
    tabelRefId:lastInsertedId,
    orderType:"services",
    serviceName: req.body.ServiceName,
    devoteeName: req.body.devoteeName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.devoteeEmail,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    orderNotes: req.body.orderNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.amount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    ticketId: serviceBookId,
    items: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await AdminTranscationModel.create(adminTransData);

  const data = {
    success: true,
    message: "serviceData details added successfully",
  };

  return { data, status: 200 };
};

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(user, activationLink,'service booking email').serviceConfirmation();
};


module.exports = {
  getAllServices,
  getServicesByGodId,
  addServiceDetails,
  updateServiceDetailsByGodId,
  inactivateServiceByServiceId,
  inactivateServiceByGodId,
  getServiceByServiceId,
  createBookings
};
