// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// # creating schema
const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "category required"],
      unique: [true, "category must be unique"],
      index: [true, "index must be exist"],
      minlengh: [3, "too short category name"],
      maxlengh: [32, "too long category name"],
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
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
};

categorySchema.post("init", (doc) => imageUrl(doc));

categorySchema.post("save", (doc) => imageUrl(doc));
// # model of schema
const Category = mongoose.model("Category", categorySchema);
// CateModel.createIndexes();
module.exports = Category;
