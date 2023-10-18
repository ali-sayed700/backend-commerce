// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
// # creating schema
const ProductSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "product title required"],
      minlengh: [3, "too short product title"],
      maxlengh: [100, "too long product title"],
      trim: true,
    },
    // A and B >> www.shop.com/(a-and-b)
    slug: {
      type: String,
      lowercase: true,
      require: true,
    },
    description: {
      type: String,
      require: [true, "product description required"],
      minlengh: [2, "too short product title"],
    },
    quantity: {
      type: Number,
      require: [true, "product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "product price required"],
      trim: true,
      max: [2000000, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      require: [true, "product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to category"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Bategory",
    },
    ratingsAverg: {
      type: Number,
      min: [1, "rating must be above or equal 1.0"],
      max: [5, "rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    // create creatAt and  updateAt
    timestamps: true,
    // to enable vitula populate
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...opts,
  }
);
// using populate with virual >> populated virtual contains collect of documents from another collection
// Population is the process of automatically replacing the specified paths in the document with document(s). We may populate a single document
// **** it helps to make parent ref one to many
ProductSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "product",
  localField: "_id",
});

// mongoose query middleware
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id ",
  });
  next();
});
const imageUrl = (doc) => {
  if (doc.imageCover) {
    const imgUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imgUrl;
  }
  if (doc.images) {
    const imgList = [];
    doc.images.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/products/${img}`;
      imgList.push(imgUrl);
    });

    doc.images = imgList;
  }
};

ProductSchema.post("init", (doc) => imageUrl(doc));

ProductSchema.post("save", (doc) => imageUrl(doc));
// # model of schema
const Product = mongoose.model("Product", ProductSchema);
// CateModel.createIndexes();
module.exports = Product;
