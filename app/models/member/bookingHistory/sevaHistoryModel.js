const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  billingAddress: String,
  billingCity: String,
  billingZipcode: String,
  state: String,
});

const ServiceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderType: {
      type: String,
    },
    sevaType: {
      type: String,
    },
    devoteeName: {
      type: String,
    },
    devoteePhoneNumber: {
      type: String,
    },
    devoteeEmail: {
      type: String,
    },
    devoteeId: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    billingAddress: addressSchema,
    sevaName: {
      type: String,
    },
    NoOfPerson: {
      type: Number,
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
    sevaBookId: {
      type: String,
    },
    bookingDate: {
      type: String,
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

module.exports = mongoose.model("SevaHistory", ServiceSchema);
