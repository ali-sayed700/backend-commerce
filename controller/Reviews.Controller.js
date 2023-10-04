// const asyncHandler = require("express-async-handler");

const Reviews = require("../model/Reviews.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");

// created for nested route
exports.setProductId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// # nested route Get api/v1/product/:categoryId/reviews
exports.createFilterObj = (req, res, next) => {
  let FiltersObject = {};
  if (req.params.productId) FiltersObject = { product: req.params.productId };
  req.filterObj = FiltersObject;
  next();
};

// # Get All data
exports.GetReview = GetAll(Reviews);

// # Get one  data by id
exports.GetOneReview = GetOne(Reviews);
// # Post data to database

exports.PostReview = CreateOne(Reviews);

// # Update data to database
exports.UpdateReview = UpdateOne(Reviews);
// # delete data to database

exports.DeleteReview = DeleteOne(Reviews);
