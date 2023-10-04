// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");

const CateModel = require("../model/Category.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");

const { uploadSingleImage } = require("../middlewares/UploadImageMiddleware");

// desktop engine >> if i leave the pic without adjusting

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   // to make it has unique name
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now().jpg
//     console.log(file);
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

exports.UploadCategoryImage = uploadSingleImage("image");

// memory storage engine
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/categories/${filename}`);
    // save images in db
    req.body.image = filename;
  }
  next();
});

// # Get All data
exports.GetCategory = GetAll(CateModel);

// # Get one  data by id
exports.GetOneCategory = GetOne(CateModel);

// # Post data to database

exports.PostCategory = CreateOne(CateModel);

// # Update data to database
exports.UpdateCategory = UpdateOne(CateModel);
// # delete data to database

exports.DeleteCategory = DeleteOne(CateModel);

// for studying

// const slugify = require("slugify");

// const asyncHandler = require("express-async-handler");
// const CateModel = require("../model/Category.Model");

// const ApiError = require("../utility/ApiError");
// const ApiFeature = require("../utility/ApiFeatures");
// // # Get All data
// exports.GetCategory = asyncHandler(async (req, res) => {
// http://localhost:8000/api/v1/categories?page=1&limit=4
// this link is related in (re.query)
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 5;
// const skip = (page - 1) * limit;
// const category = await CateModel.find({}).skip(skip).limit(limit);
// res.status(200).json({ results: category.length, data: category });

//   const countDocument = await CateModel.countDocuments();
//   const ApiFeatures = new ApiFeature(CateModel.find(), req.query)
//     .filter()
//     .search()
//     .paginate(countDocument)
//     .sort()
//     .limitFields();

//   const { mongooseQuery, paginationResult } = ApiFeatures;
//   const category = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: category.length, paginationResult, data: category });
// });

// // # Get one  data by id
// exports.GetOneCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await CateModel.findById(id);
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });

// // # Post data to database

// exports.PostCategory = asyncHandler(async (req, res) => {
//   const { name } = req.body;

//   const category = await CateModel.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: category });
// });

// // # Update data to database
// exports.UpdateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const category = await CateModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true } // to back category after update not before
//   );
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });
// // # delete data to database

// exports.DeleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await CateModel.findByIdAndDelete(id);
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(204).send();
// });
// --------------------------------------------------------------
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
