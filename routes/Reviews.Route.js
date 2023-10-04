const express = require("express");

const {
  PostReview,
  GetReview,
  GetOneReview,
  UpdateReview,
  DeleteReview,
  createFilterObj,
  setProductId,
} = require("../controller/Reviews.Controller");
const {
  GetReviewValidator,
  CreateReviewValidator,
  UpdateReviewValidator,
  DeleteReviewValidator,
} = require("../validators/ReviewsValidate");

const Auth = require("../controller/Auth.Controller");
// # import subcategories router
// # nested route
const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(createFilterObj, GetReview)
  .post(
    Auth.Protect,
    Auth.AllowedTo("user"),
    setProductId,
    CreateReviewValidator,
    PostReview
  );
Router.route("/:id")
  .get(GetReviewValidator, GetOneReview)
  .put(
    Auth.Protect,
    Auth.AllowedTo("user"),
    UpdateReviewValidator,

    UpdateReview
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("user", "admin", "manager"),
    DeleteReviewValidator,
    DeleteReview
  );
module.exports = Router;
