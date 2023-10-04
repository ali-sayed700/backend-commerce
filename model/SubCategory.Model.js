// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema

const SubCategorySChema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Subcategory required"],
      trim: true,
      unique: [true, "Subcategory must be unique"],
      index: [true, "index must be exist"],
      minlengh: [2, "too short Subcategory name"],
      maxlengh: [32, "too long Subcategory name"],
    },
    // A and B >> www.shop.com/(a-and-b)
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belong to parent  category"],
    },
  },
  { timestamps: true } // create creatAt and  updateAt
);
// SubCategorySChema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name -_id ",
//   });
//   next();
// });
// # model of schema
const SubCategory = mongoose.model("SubCategory", SubCategorySChema);
// CateModel.createIndexes();
module.exports = SubCategory;
