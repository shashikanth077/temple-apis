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
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    orderType: {
      type: String,
    },
    eventName: {
      type: String,
    },
    devoteeName: {
      type: String,
    },
    devoteePhoneNumber: {
      type: String,
    },
    venue: {
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
    organizerPhone: {
      type: String,
    },
    organizerEmail: {
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
    eventBookId: {
      type: String,
    },
    organizer: {
      type: String,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
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

module.exports = mongoose.model("EventBookingHistory", ServiceSchema);
