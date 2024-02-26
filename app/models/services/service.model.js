const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
  {
    godId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "God",
      required: true,
    },
    godName: {
      type: String,
      ref: "God",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    image: {
      type: String
    },
    daysahead: {
      type: String
    },
    occurmonth: {
      type: Array
    },
    frequency: {
      type: String
    },
    bookingType: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    accountNumber: {
      type: String
    },
    isTaxable: {
      type: Boolean
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
