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
    donorName: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    donatedItems: {
      type: [itemSchema],
      default: [],
    },
    billingAddress: addressSchema,
    donorEmail: {
      type: String,
    },
    frequency: {
      type: String,
    },
    donorPhoneNumber: {
      type: String,
    },
    donorNotes: {
      type: String,
    },
    stripeReferenceId: {
      type: String,
    },
    donatedAmount: {
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
