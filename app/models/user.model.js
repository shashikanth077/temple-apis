const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: String,
    password: {
      type: String,
      required: true,
    },
    activationToken: String,
    activationTokenExpiry: {
      type: Date
    },
    createdDate: {
      type: Date,
      default: Date.now,
      //expires: 86400
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    activated: Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    viewRoles: {
      type: Array
    }
  })
);

module.exports = User;
