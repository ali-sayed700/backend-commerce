// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema
const cartSchema = new Schema(
  {
    cartItem: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // create creatAt and  updateAt
);

// # model of schema
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
