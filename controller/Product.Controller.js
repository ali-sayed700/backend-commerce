// const multer = require("multer");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
// const ApiError = require("../utility/ApiError");

const ProductModel = require("../model/Product.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");
const { uploadMixImages } = require("../middlewares/UploadImageMiddleware");

// const multerStorage = multer.memoryStorage();
// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("only image allowed", 400), false);
//   }
// };
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadImageMulti = upload.fields([
//   { name: "imageCover", maxCount: 1 },
//   { name: "images", maxCount: 5 },
// ]);

exports.uploadImageMult = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeAllImages = asyncHandler(async (req, res, next) => {
  // console.log(req);
  if (req.files.imageCover) {
    const fileImgCover = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/products/${fileImgCover}`);
    // save images in db
    req.body.imageCover = fileImgCover;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`uploads/products/${imageName}`);
        // save images in db
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

// # Get All data
exports.GetProduct = GetAll(ProductModel, "product");

// # Get one  data by id
exports.GetOneProduct = GetOne(ProductModel, "reviews");
// # Post data to database

exports.PostProduct = CreateOne(ProductModel);

// # Update data to database
exports.UpdateProduct = UpdateOne(ProductModel);
// # delete data to database

exports.DeleteProduct = DeleteOne(ProductModel);

// for studying

// const slugify = require("slugify");

// const asyncHandler = require("express-async-handler");
// const ProductModel = require("../model/Product.Model");
// const ApiFeature = require("../utility/ApiFeatures");
// const ApiError = require("../utility/ApiError");
// // # Get All data
// exports.GetProduct = asyncHandler(async (req, res) => {
//   // 1- filtering
//   // // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   // const queryStringObj = { ...req.query };
//   // const excudeFields = ["page", "limit", "fields", "sort", "keyword"];
//   // excudeFields.forEach((field) => delete queryStringObj[field]);

//   // // Aply filtering using [gt-gte-lt-lte]
//   // let queryStr = JSON.stringify(queryStringObj);
//   // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

//   //2- pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 50;
//   // const skip = (page - 1) * limit;

//   // build query
//   // let mangooseQuery = ProductModel.find(JSON.parse(queryStr))
//   //   .skip(skip)
//   //   .limit(limit)
//   // .populate({
//   //   path: "category",
//   //   select: "name -_id ",
//   // });

//   // sorting query
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(",").join(" ");
//   //   console.log(sortBy);
//   //   mangooseQuery = mangooseQuery.sort(sortBy);
//   // } else {
//   //   mangooseQuery = mangooseQuery.sort("-createdAt");
//   // }
//   // select query
//   // if (req.query.fields) {
//   //   const sortBy = req.query.fields.split(",").join(" ");
//   //   mangooseQuery = mangooseQuery.select(sortBy);
//   // } else {
//   //   mangooseQuery = mangooseQuery.select("-createdAt");
//   // }
//   // search
//   // if (req.query.keyword) {
//   //   const query = {};
//   //   query.$or = [
//   //     { title: { $regex: req.query.keyword, $options: "i" } },
//   //     { description: { $regex: req.query.keyword, $options: "i" } },
//   //   ];
//   //   mangooseQuery = mangooseQuery.find(query);
//   // }
//   // excute query
//   const countDocument = await ProductModel.countDocuments();
//   const ApiFeatures = new ApiFeature(ProductModel.find(), req.query)
//     .filter()
//     .search("product")
//     .paginate(countDocument, "product")
//     .sort()
//     .limitFields();

//   const { mongooseQuery, paginationResult } = ApiFeatures;
//   const product = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: product.length, paginationResult, data: product });
// });

// // # Get one  data by id
// exports.GetOneProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await ProductModel.findById(id);
//   if (!product) {
//     // res.status(404).json({ msg: `no product for this ${id}` });
//     return next(new ApiError(`no product for this ${id}`, 404));
//   }
//   res.status(200).json({ data: product });
// });

// // # Post data to database

// exports.PostProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);

//   const product = await ProductModel.create(req.body);
//   res.status(201).json({ data: product });
// });

// // # Update data to database
// exports.UpdateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }

//   const product = await ProductModel.findOneAndUpdate(
//     { _id: id },
//     req.body,
//     { new: true } // to back Product after update not before
//   );
//   if (!product) {
//     // res.status(404).json({ msg: `no Product for this ${id}` });
//     return next(new ApiError(`no product for this ${id}`, 404));
//   }
//   res.status(200).json({ data: product });
// });
// // # delete data to database

// exports.DeleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await ProductModel.findByIdAndDelete(id);
//   if (!product) {
//     // res.status(404).json({ msg: `no Product for this ${id}` });
//     return next(new ApiError(`no product for this ${id}`, 404));
//   }
//   res.status(204).send();
// });

// // exports.PostCategory = (req, res) => {
// //   let name = req.body.name;

// //   let CateName = new CateModel({ name });
// //   CateName.save()
// //     .then((doc) => {
// //       res.json(doc);
// //     })
// //     .catch((err) => {
// //       res.json(err);
// //     });
// // };

// // ex 2 for handling error with async

// // exports.PostCategory = async (req, res) => {
// //   let name = req.body.name;
// //   try {
// //     let category = await CateModel.create({ name, slug: slugify(name) });
// //     res.status(201).json({ data: category });
// //   } catch (err) {
// //     res.status(400).send(err);
// //   }
// // };
