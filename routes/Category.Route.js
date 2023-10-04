const express = require("express");

const {
  PostCategory,
  GetCategory,
  GetOneCategory,
  UpdateCategory,
  DeleteCategory,
  UploadCategoryImage,
  resizeImg,
} = require("../controller/Category.Controller");
const {
  GetCategoryValidator,
  CreateCategoryValidator,
  UpdateCategoryValidator,
  DeleteCategoryValidator,
} = require("../validators/CategoryValidate");
// # import subcategories router
const SubCategoryRoute = require("./SubCategory.Route");

const Auth = require("../controller/Auth.Controller");

const Router = express.Router();

// # nested route
Router.use("/:categoryId/SubCategories", SubCategoryRoute);
// # Routes
Router.route("/")
  .get(Auth.Protect, Auth.AllowedTo("admin", "manager"), GetCategory)
  .post(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    UploadCategoryImage,
    resizeImg,
    CreateCategoryValidator,
    PostCategory
  );
Router.route("/:id")
  .get(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    GetCategoryValidator,
    GetOneCategory
  )
  .put(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    UploadCategoryImage,
    resizeImg,
    UpdateCategoryValidator,
    UpdateCategory
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    DeleteCategoryValidator,
    DeleteCategory
  );
module.exports = Router;
