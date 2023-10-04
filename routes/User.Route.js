const express = require("express");

const {
  PostUser,
  GetUser,
  GetOneUser,
  UpdateUser,
  UpdateUserPassword,
  DeleteUser,
  UploadUserImage,
  resizeImg,
  GetLoggedUser,
  UpdatePasswordUser,
  UpdateLoggedUser,
  DeleteLoggedUser,
} = require("../controller/User.Controller");
const {
  GetUserValidator,
  CreateUserValidator,
  UpdateUserValidator,
  DeleteUserValidator,
  UpdateUserPassValidator,
  UpdateLoggedUserValidator,
} = require("../validators/UserValidate");

const Auth = require("../controller/Auth.Controller");

// # import subcategories router
const Router = express.Router();
Router.use(Auth.Protect);

// user
Router.get("/getme", GetLoggedUser, GetOneUser);
Router.put("/changePassword", UpdatePasswordUser);
Router.put(
  "/updateme",

  UpdateLoggedUserValidator,
  UpdateLoggedUser
);
Router.delete("/deleteme", DeleteLoggedUser);

// admin
Router.use(Auth.AllowedTo("user", "admin", "manager"));
//  it is for change password only
Router.put("/changepassword/:id", UpdateUserPassValidator, UpdateUserPassword);

Router.route("/")
  .get(GetUser)
  .post(UploadUserImage, resizeImg, CreateUserValidator, PostUser);
Router.route("/:id")
  .get(GetUserValidator, GetOneUser)
  .put(UploadUserImage, resizeImg, UpdateUserValidator, UpdateUser)
  .delete(DeleteUserValidator, DeleteUser);
module.exports = Router;
