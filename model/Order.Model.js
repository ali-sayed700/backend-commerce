// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema
const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    cartItem: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shoppingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shoppingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true } // create creatAt and  updateAt
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone imageProfile",
  }).populate({
    path: "cartItem.product",
    select: "title imageCover",
  });
  next();
});
// # model of schema
const Order = mongoose.model("Order", orderSchema);
// CateModel.createIndexes();
module.exports = Order;
