const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  billingAddress: String,
  billingCity: String,
  billingZipcode: String,
  state: String,
});

const TranscationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tabelRefId:{
      type: mongoose.Schema.Types.ObjectId,
    },
    billingAddress: addressSchema,
    serviceName: {
      type: String,
      required: true,
    },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    ticketId: {
      type: String,
      required: true,
    },
    devoteeId: {
      type: Number,
    },
    paymentMode: {
      type: Array,
    },
    stripeReferenceId: {
      type: String,
    },
    orderType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
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
    transStatus: {
      type: String,
    },
    orderNotes: {
      type: String,
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

module.exports = mongoose.model("TranscationDetails", TranscationSchema);
