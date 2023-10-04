const express = require("express");

const {
  PostCart,
  GetCart,
  RemoveCart,
  RemoveAllCart,
  UpdateCart,
  ApplyCoupon,
} = require("../controller/Cart.Controller");

const Auth = require("../controller/Auth.Controller");

// # import subcategories router
const Router = express.Router();
Router.use(Auth.Protect, Auth.AllowedTo("user", "admin"));
Router.put("/applyCoupon", ApplyCoupon);
Router.route("/").get(GetCart).post(PostCart).delete(RemoveAllCart);
Router.route("/:cartId").put(UpdateCart).delete(RemoveCart);

module.exports = Router;
