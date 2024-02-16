const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    address1: String,
    address2: String,
    city: String,
    postalCode: String,
    province: String,
});

const itemSchema = new Schema({
    name: String,
    productId:String,
    quantity: Number,
    price: {
      type: Number,
      default: 0,
    }
});

const BookingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    OrderId: {
        type: String,
        required: true
    },
    devoteeId : {
        type:Number
    },
    paymentMethod: {
        type: String,
    },
    paymentMode: {
        type: Array,
    },
    StripeReferenceId:{
        type:String
    },
    orderType: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    Items: {
        type: [itemSchema],
        default: [],
    },
    billingAddress:addressSchema,
    OrderDate: {
      type: String,
      required: true
    },
    devoteeName:{
        type:String
    },
    devoteePhoneNumber:{
        type:String
    },
    devoteeEmail:{
        type:String
    },
    transStatus: {
        type: String,
    },
    orderNotes:{
        type:String
    },
    OrderDate:{
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopOrders", BookingSchema);
