const express = require("express");

const {
  PostCoupon,
  GetCoupon,
  GetOneCoupon,
  UpdateCoupon,
  DeleteCoupon,
} = require("../controller/Coupon.Controller");
// const {
//   GetBrandValidator,
//   CreateBrandValidator,
//   UpdateBrandValidator,
//   DeleteBrandValidator,
// } = require("../validators/BrandValidate");

const Auth = require("../controller/Auth.Controller");

// # import subcategories router
const Router = express.Router();

// # nested route

Router.route("/")
  .get(Auth.Protect, Auth.AllowedTo("admin", "manager"), GetCoupon)
  .post(
    Auth.Protect,
    Auth.AllowedTo("admin"),

    PostCoupon
  );
Router.route("/:id")
  .get(Auth.Protect, Auth.AllowedTo("admin"), GetOneCoupon)
  .put(
    Auth.Protect,
    Auth.AllowedTo("admin"),

    UpdateCoupon
  )
  .delete(
    Auth.Protect,
    Auth.AllowedTo("admin"),

    DeleteCoupon
  );
module.exports = Router;
