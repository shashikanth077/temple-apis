const Service = require("../models/service.model");
const God = require("../models/god.model");
const { logger } = require("../../app/middlewares");
const { allowedBookingTypes, allowedServiceTypes,PUBLIC_URL } = require("../utils/constants");
const { isNullOrUndefined } = require("../utils/index")

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
    const service = await Service.findOne({ _id: serviceId, deleted: false});

    if (!service) { 
        const data = { success: false, message: "Service doesn't exist"};
        return {data, status: 404 };
    } else {
        const data = { success: true, service};
        return {data, status: 200 };
    }
  };

const addServiceDetails = async (req) => {

  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  // validation for booking and service types
  const isValidServiceTypes = req && req.body && !isNullOrUndefined(req.body.serviceType)
   && allowedServiceTypes.includes(req.body.serviceType);

   const isValidBookingTypes = req && req.body && !isNullOrUndefined(req.body.bookingType)
   && allowedBookingTypes.includes(req.body.bookingType);

  if (!isValidServiceTypes || !isValidBookingTypes) {
    const data = { success: false, message: "invalid serviceType or bookingType request" };
    return { data, status: 400 };
  }

  const god = await God.findOne({ _id: req.params.godId, deleted: false });

  if (!god) {
    const data = { success: false, message: "God Details not found" };
    return { data, status: 404 };
  }

  const imagePath = PUBLIC_URL+'uploads/services/'+req.file.filename;
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
      _id: req.params.serviceId, deleted: false
    });
  
    if (!existingServiceId || existingServiceId === null) {
      const data = {
        success: false,
        message: "Service details doesn't exists for this god",
      };
      return { data, status: 404 };
    }
  
    if(isNullOrUndefined(req.file?.filename)){
      req.body.image = existingServiceId.image;
    } else {
      const imagePath = PUBLIC_URL+'uploads/events/'+req?.file?.filename;
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
      _id: req.params.serviceId, deleted: false
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
        {$set: {'deleted': true}, 'modifiedAt': Date.now()},
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

    const query = {godId: req.params.godId, deleted: false};

    await Service.updateMany(query, 
        {$set: {'deleted': true}, 'modifiedAt': Date.now()});
    const data = {
      success: true,
      message: "Service inactivated successfully for the god details"
    };

    return { data, status: 200 };
  };

module.exports = {
  getAllServices,
  getServicesByGodId,
  addServiceDetails,
  getServiceByServiceId,
  updateServiceDetailsByGodId,
  inactivateServiceByServiceId,
  inactivateServiceByGodId
};
