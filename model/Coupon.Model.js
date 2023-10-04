// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema
const couponSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "coupon requried"],
      unique: [true, "coupon must be unique"],
      index: [true, "index must be exist"],
      trim: true,
    },
    // A and B >> www.shop.com/(a-and-b)
    expire: {
      type: Date,
      require: [true, "coupon expire  time  requried"],
    },
    discount: {
      type: Number,
      require: [true, "coupon discount value requried"],
    },
  },
  { timestamps: true } // create creatAt and  updateAt
);

// # model of schema
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
