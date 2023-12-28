const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
      },
    discount: {
        type: Number,
      },
    shortDescription: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
        required: true
    },   
    categories: {
        type: Array,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        //expires: 900,
      },
      modifiedAt: {
        type: Date,
        default: Date.now
      },
      deleted: {
        type: Boolean,
        default: false
      }
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
