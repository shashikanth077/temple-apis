const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  postalCode: String,
  province: String,
  phone: String,
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
    donor: {
      type: String,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    donationType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    address: addressSchema,
    donatedItems: [itemSchema],
    subTotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    totalDonationAmount: {
      type: Number,
      default: 0,
    },
    isSameAsHomeAddress: {
      type: Boolean,
      required: true,
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
