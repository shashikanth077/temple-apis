const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeceasedPersonDetails = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    relationship:{
      type:String,
    },
    personName:{
      type:String,
    },
    masam:{
        type:String
    },
    deathDate:{
      type:String,
    },
    tithi:{
        type:String
    },
    deathPlace:{
        type:String
    },
    paksha:{
        type:String
    },
    deathTime:{
        type:String
    },
    star:{
      type:String,
    },
    gotram:{
      type:String,
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

module.exports = mongoose.model("deceasedPersonDetails", DeceasedPersonDetails);
