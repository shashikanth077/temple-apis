const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    owner: {
      type: ObjectID,
      required: false,
      ref: "User",
    },
    sessionId: {
      type: String,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    items: [
      {
        productId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        subTotal: Number,
        name: String,
        discount: Number,
        image: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      // expires: 2400,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
