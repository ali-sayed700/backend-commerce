const express = require("express");

const {
  PostBrand,
  GetBrand,
  GetOneBrand,
  UpdateBrand,
  DeleteBrand,
  UploadBrandImage,
  resizeImg,
} = require("../controller/Brand.Controller");
const {
  GetBrandValidator,
  CreateBrandValidator,
  UpdateBrandValidator,
  DeleteBrandValidator,
} = require("../validators/BrandValidate");

const Auth = require("../controller/Auth.Controller");

// # import subcategories router
const Router = express.Router();

// # nested route

Router.route("/")
  .get(Auth.Protect, Auth.AllowedTo("admin", "manager"), GetBrand)
  .post(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    UploadBrandImage,
    resizeImg,
    CreateBrandValidator,
    PostBrand
  );
Router.route("/:id")
  .get(Auth.Protect, Auth.AllowedTo("admin"), GetBrandValidator, GetOneBrand)
  .put(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    UploadBrandImage,
    resizeImg,
    UpdateBrandValidator,
    UpdateBrand
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("admin"),
    DeleteBrandValidator,
    DeleteBrand
  );
module.exports = Router;
