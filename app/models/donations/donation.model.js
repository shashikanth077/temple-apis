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
  description: String,
  quantity: Number,
  price: {
    type: Number,
    default: 0,
  },
  totalPrice: Number,
});

const DonationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donateTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_DonationType",
      required: true,
    },
    donationType: {
      type: String,
    },
    devoteeName: {
      type: String,
    },
    devoteeId : {
        type:Number
    },
    prasadamOverEmail:{
      type:Boolean
    },
    paymentMethod: {
      type: String,
    },
    donatedItems: {
      type: [itemSchema],
      default: [],
    },
    billingAddress: addressSchema,
    devoteeEmail: {
      type: String,
    },
    frequency: {
      type: String,
    },
    devoteePhoneNumber: {
      type: String,
    },
    orderNotes: {
      type: String,
    },
    stripeReferenceId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    transStatus: {
      type: String,
    },
    paymentMode: {
      type: Array,
    },
    taxReceiptNo: {
      type: String,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);
