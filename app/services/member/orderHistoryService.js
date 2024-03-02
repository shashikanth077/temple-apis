const BookingHistoryModel = require("../../models/member/bookingHistory/bookingHistoryModel");
const ServiceHistoryModel = require("../../models/member/bookingHistory/serviceHistoryModel");
const SevaHistoryModel = require("../../models/member/bookingHistory/sevaHistoryModel");
const EventHistoryModel = require("../../models/member/bookingHistory/eventHistoryModel");
const AdminTranscationModel = require("../../models/admin/adminTranscationModel");

const { isNullOrUndefined } = require("../../utils/index");

const GetOrderDetailsById = async (req) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  let orders;
  if (req.params.type === "shop-orders") {
    orders = await BookingHistoryModel.find({ userId: req.params.id });
  }

  if (req.params.type === "services") {
    orders = await ServiceHistoryModel.find({ userId: req.params.id });
  }

  if (req.params.type === "seva") {
    orders = await SevaHistoryModel.find({ userId: req.params.id });
  }

  if (req.params.type === "events") {
    orders = await EventHistoryModel.find({ userId: req.params.id });
  }

  if (!orders) {
    const data = { success: false, message: "Order details doesn't exist" };
    return { data, status: 404 };
  } else {
    const data = { success: true, orders };
    return { data, status: 200 };
  }
};

const getTranscationDetails = async (req) => {
  try {
    const { query } = req;

    // Build the filter object based on your requirements
    const queryFilter = {};

    // Example: Add filters to the query object
    if (query.ticketId) {
      queryFilter.ticketId = query.ticketId;
    }

    if (query.devoteeId) {
      queryFilter.devoteeId = query.devoteeId;
    }

    if (query.serviceName) {
      queryFilter.serviceName = query.serviceName;
    }

    if (query.devoteePhoneNumber) {
      queryFilter.devoteePhoneNumber = query.devoteePhoneNumber;
    }

    if (query.devoteeName) {
      queryFilter.devoteeName = query.devoteeName;
    }

    if (query.createdAt) {
      // Assuming createdAt is a string in the format 'YYYY-MM-DD'
      const startDate = new Date(`${query.createdAt}T00:00:00.000Z`);
      const endDate = new Date(`${query.createdAt}T23:59:59.999Z`);

      // Add date range to the query
      queryFilter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Fetch transaction details based on the constructed query
    const orders = await AdminTranscationModel.find(queryFilter);

    if (!orders || orders.length === 0) {
      const data = {
        success: false,
        message: "Transaction data doesn't exist for the given filters.",
        reports: [],
      };
      return { data, status: 404 };
    } else {
      const data = { success: true, reports: orders };
      return { data, status: 200 };
    }
  } catch (error) {
    const data = { success: false, error };
    return { data, status: 500 };
  }
};

module.exports = {
  GetOrderDetailsById,
  getTranscationDetails,
};
