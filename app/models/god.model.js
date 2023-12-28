const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
        type: Array
    },
    worshipDay: {
      type: Array,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("God", GodSchema);
