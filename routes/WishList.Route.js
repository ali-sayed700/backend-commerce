const express = require("express");

const Auth = require("../controller/Auth.Controller");
const {
  AddProdcutToWhishList,
  DeleteProdcutFromWhishList,
  getLoggedUserWishList,
} = require("../controller/WishList.Controller");
const {
  VaildateToWishList,
  DelVaildateFromWishList,
} = require("../validators/WishListValidate");

const Router = express.Router();

Router.use(Auth.Protect, Auth.AllowedTo("user"));

Router.route("/")
  .post(VaildateToWishList, AddProdcutToWhishList)
  .get(getLoggedUserWishList);

Router.route("/:productId").delete(
  DelVaildateFromWishList,
  DeleteProdcutFromWhishList
);

module.exports = Router;
