// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../middlewares/UploadImageMiddleware");

const BrandModel = require("../model/Brand.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");

// upload single images
exports.UploadBrandImage = uploadSingleImage("image");

// // memory storage engine
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`uploads/brands/${filename}`);
  // save images in db
  req.body.image = filename;
  next();
});

// # Get All data
exports.GetBrand = GetAll(BrandModel);

// # Get one  data by id
exports.GetOneBrand = GetOne(BrandModel);
// # Post data to database

exports.PostBrand = CreateOne(BrandModel);

// # Update data to database
exports.UpdateBrand = UpdateOne(BrandModel);
// # delete data to database

exports.DeleteBrand = DeleteOne(BrandModel);

// for studying
// const slugify = require("slugify");

// const asyncHandler = require("express-async-handler");
// const BrandModel = require("../model/Brand.Model");

// const ApiError = require("../utility/ApiError");
// const ApiFeature = require("../utility/ApiFeatures");
// // # Get All data
// exports.GetBrand = asyncHandler(async (req, res) => {
//   // http://localhost:8000/api/v1/categories?page=1&limit=4
//   // this link is related in (re.query)
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;
//   // const brand = await BrandModel.find({}).skip(skip).limit(limit);

//   const countDocument = await BrandModel.countDocuments();
//   const ApiFeatures = new ApiFeature(BrandModel.find(), req.query)
//     .filter()
//     .search()
//     .paginate(countDocument)
//     .sort()
//     .limitFields();

//   const { mongooseQuery, paginationResult } = ApiFeatures;
//   const brand = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: brand.length, paginationResult, data: brand });
// });

// // # Get one  data by id
// exports.GetOneBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await BrandModel.findById(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

// // # Post data to database

// exports.PostBrand = asyncHandler(async (req, res) => {
//   const { name } = req.body;

//   const brand = await BrandModel.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: brand });
// });

// // # Update data to database
// exports.UpdateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const brand = await BrandModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true } // to back category after update not before
//   );
//   if (!brand) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });
// // # delete data to database

// exports.DeleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await BrandModel.findByIdAndDelete(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(204).send();
// });
