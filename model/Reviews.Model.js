// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

const ProductModel = require("./Product.Model");

const Reviews = new Schema(
  {
    title: { type: String },
    rating: {
      type: Number,
      min: [1, "min rating value 1.0"],
      max: [5, "max rating value 5.0"],
      required: [true, "review must be exist"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must be belong to user"],
    },
    // parent reference one to many
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must be belong to product"],
    },
  },
  { timestamps: true }
);
Reviews.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });

  next();
});

Reviews.statics.CalcAve = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "product",
        avgRatings: {
          $avg: "$rating",
        },
        ratingsQuanitiy: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverg: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuanitiy,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverg: 0,
      ratingsQuantity: 0,
    });
  }
};

Reviews.post("save", async function () {
  await this.constructor.CalcAve(this.product);
});
Reviews.post("deleteOne", async function () {
  await this.constructor.CalcAve(this.product);
});

module.exports = mongoose.model("Reviews", Reviews);
