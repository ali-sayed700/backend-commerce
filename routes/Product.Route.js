const express = require("express");

const {
  PostProduct,
  GetProduct,
  GetOneProduct,
  UpdateProduct,
  DeleteProduct,
  uploadImageMult,
  resizeAllImages,
} = require("../controller/Product.Controller");
const {
  GetProductValidator,
  CreateProductValidator,
  UpdateProductValidator,
  DeleteProductValidator,
} = require("../validators/ProductValidate");

const Auth = require("../controller/Auth.Controller");

const Router = express.Router();

const Reviews = require("./Reviews.Route");
// # nested route
Router.use("/:productId/reviews", Reviews);
// # Routes
Router.route("/")
  .get(Auth.Protect, Auth.AllowedTo("user", "admin", "manager"), GetProduct)
  .post(
    Auth.Protect,
    Auth.AllowedTo("user", "admin"),
    uploadImageMult,
    resizeAllImages,
    CreateProductValidator,
    PostProduct
  );
Router.route("/:id")
  .get(
    Auth.Protect,
    Auth.AllowedTo("user", "admin"),
    GetProductValidator,
    GetOneProduct
  )
  .put(
    Auth.Protect,
    Auth.AllowedTo("user", "admin"),
    uploadImageMult,
    resizeAllImages,
    UpdateProductValidator,
    UpdateProduct
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("user", "admin"),
    DeleteProductValidator,
    DeleteProduct
  );
module.exports = Router;
