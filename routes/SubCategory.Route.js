const express = require("express");

const {
  PostSubCategory,
  GetSubCategory,
  GetOneSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
  setCategoryId,
  createFilterObj,
} = require("../controller/SubCategory.Controller");

const {
  GetSubCategoryValidator,
  CreateSubCategoryValidator,
  UpdateSubCategoryValidator,
  DeleteSubCategoryValidator,
} = require("../validators/SubCategoryValidate");

const Auth = require("../controller/Auth.Controller");

// # mergparams >> allow us to access paramaters on other routers
// # we need to access categoryId from category router
const Router = express.Router({ mergeParams: true });

// # Routes
Router.route("/")
  .post(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    setCategoryId,
    CreateSubCategoryValidator,
    PostSubCategory
  )
  .get(
    Auth.Protect,
    Auth.AllowedTo("admin", "manager"),
    createFilterObj,
    GetSubCategory
  );
Router.route("/:id")
  .get(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    GetSubCategoryValidator,
    GetOneSubCategory
  )
  .put(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    UpdateSubCategoryValidator,
    UpdateSubCategory
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    DeleteSubCategoryValidator,
    DeleteSubCategory
  );
module.exports = Router;

// .get(GetCategory).
