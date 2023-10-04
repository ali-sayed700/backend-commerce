// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema
const brandSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "brand required"],
      unique: [true, "brand must be unique"],
      index: [true, "index must be exist"],
      minlengh: [3, "too short brand name"],
      maxlengh: [32, "too long brand name"],
    },
    // A and B >> www.shop.com/(a-and-b)
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } // create creatAt and  updateAt
);
const imageUrl = (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imgUrl;
  }
};

brandSchema.post("init", (doc) => imageUrl(doc));

brandSchema.post("save", (doc) => imageUrl(doc));
// # model of schema
const Brand = mongoose.model("Brand", brandSchema);
// CateModel.createIndexes();
module.exports = Brand;
