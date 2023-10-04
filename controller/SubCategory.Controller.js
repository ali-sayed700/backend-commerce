const SubCategoryModel = require("../model/SubCategory.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");

// create subcategory by category id

exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// # nested route Get api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let FiltersObject = {};
  if (req.params.categoryId)
    FiltersObject = { category: req.params.categoryId };
  req.filterObj = FiltersObject;
  next();
};

// # Get All data
exports.GetSubCategory = GetAll(SubCategoryModel, "subcategory");

// # Get one  data by id
exports.GetOneSubCategory = GetOne(SubCategoryModel);

// # Post data to database

exports.PostSubCategory = CreateOne(SubCategoryModel);
// # Update data to database
exports.UpdateSubCategory = UpdateOne(SubCategoryModel);
// # delete data to database

exports.DeleteSubCategory = DeleteOne(SubCategoryModel);

// for studying
// -----------------------------------------------------//

// for studying

// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");

// const SubCategoryModel = require("../model/SubCategory.Model");
// const ApiError = require("../utility/ApiError");
// const ApiFeature = require("../utility/ApiFeatures");

// // create subcategory by category id

// exports.setCategoryId = (req, res, next) => {
//   req.body.category = req.params.categoryId;
//   next();
// };
// // # nested route Get api/v1/categories/:categoryId/subcategories
// exports.createFilterObj = (req, res, next) => {
//   let FiltersObject = {};
//   if (req.params.categoryId)
//     FiltersObject = { category: req.params.categoryId };

//   req.filterObj = FiltersObject;
//   next();
// };

// // # Get All data
// exports.GetSubCategory = asyncHandler(async (req, res) => {
//   // http://localhost:8000/api/v1/categories?page=1&limit=4
//   // this link is related in (re.query)
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;

//   // // console.log(req.params.categoryId);
//   // const Subcategory = await SubCategoryModel.find(req.filterObj)
//   //   .skip(skip)
//   //   .limit(limit);

//   // res.status(200).json({ results: Subcategory.length, data: Subcategory });

//   const countDocument = await SubCategoryModel.countDocuments();
//   const ApiFeatures = new ApiFeature(
//     SubCategoryModel.find(req.filterObj),
//     req.query
//   )
//     .filter()
//     .search()
//     .paginate(countDocument, "subcategory")
//     .sort()
//     .limitFields();

//   const { mongooseQuery, paginationResult } = ApiFeatures;
//   const Subcategory = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: Subcategory.length, paginationResult, data: Subcategory });
// });

// // # Get one  data by id
// exports.GetOneSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const Subcategory = await SubCategoryModel.findById(id).populate({
//     path: "category",
//     select: "name -_id ",
//   });
//   if (!Subcategory) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(200).json({ data: Subcategory });
// });

// // # Post data to database

// exports.PostSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body;

//   const SubCategory = await SubCategoryModel.create({
//     name,
//     slug: slugify(name),
//     category,
//   });
//   res.status(201).json({ data: SubCategory });
// });

// // # Update data to database
// exports.UpdateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, category } = req.body;

//   const Subcategory = await SubCategoryModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name), category },

//     { new: true } // to back category after update not before
//   );
//   if (!Subcategory) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(200).json({ data: Subcategory });
// });
// // # delete data to database

// exports.DeleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const Subcategory = await SubCategoryModel.findByIdAndDelete(id);
//   if (!Subcategory) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no category for this ${id}`, 404));
//   }
//   res.status(204).send();
// });

// // -----------------------------------------------------//
