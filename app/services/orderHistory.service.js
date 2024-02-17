const BookingHistoryModel = require('../models/bookingHistory/bookingHistory.model');
const ServiceHistoryModel = require('../models/bookingHistory/ServiceHistory.Model');
const SevaHistoryModel = require('../models/bookingHistory/sevaHistory.model');
const EventHistoryModel = require('../models/bookingHistory/eventHistory.model');

const User = require('../models/user/user.model');
const {
  isNullOrUndefined,
} = require("../utils/index");

const GetOrderDetailsById = async (req) => {

    if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
        const data = { success: false, message: "invalid request" };
        return { data, status: 400 };
    }

    let orders;
    if(req.params.type ==='shop-orders'){
        orders = await BookingHistoryModel.find({ userId: req.params.id});
    }  
    
    if(req.params.type ==='services'){
      orders = await ServiceHistoryModel.find({ userId: req.params.id});
    } 
    
    if(req.params.type ==='seva'){
      orders = await SevaHistoryModel.find({ userId: req.params.id});
    } 

    if(req.params.type ==='events'){
      orders = await EventHistoryModel.find({ userId: req.params.id});
    } 

    if (!orders) {
      const data = { success: false, message: "Order details doesn't exist" };
      return { data, status: 404 };
    } else {
      const data = { success: true, orders };
      return { data, status: 200 };
    }

}


module.exports =  {
    GetOrderDetailsById
}