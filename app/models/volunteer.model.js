const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoluteersSchema = new Schema(
  {
    beforevolunteer: {
        type: Boolean,
        required: true
    },
    description: {
      type: String,
    },
    address:{
      type:String,
      required:true,
    },
    city:{
      type:String,
      required:true,
    },
    state:{
      type:String,
      required:true,
    },
    zipcode:{
      type:String,
      required:true,
    },
    possibleDays:{
      type:Array,
      required:true,
    },
    activityList:{
      type:Array,
    },
    otheractivities:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true
    },
    islive: {
      type: Boolean,
      required: true
    },
    isveg: {
      type: Boolean,
      required: true
    },
    iswhatsupnumber: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true
    },
    phone: {
        type: String,
        required: true
    },
    approveStatus:{
      type:String
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

module.exports = mongoose.model("Volunteers", VoluteersSchema);
