const express = require("express");

const Auth = require("../controller/Auth.Controller");
const {
  AddAddress,
  DeleteAddress,
  getLoggedUserAddress,
} = require("../controller/Addresses.Controller");
// const {
//   VaildateToWishList,
//   DelVaildateFromWishList,
// } = require("../validators/WishListValidate");

const Router = express.Router();

Router.use(Auth.Protect, Auth.AllowedTo("user"));

Router.route("/").post(AddAddress).get(getLoggedUserAddress);

Router.route("/:addressId").delete(DeleteAddress);

module.exports = Router;
