const express = require("express");

const {
  SignUp,
  Login,
  ForgetPassowrd,
  VerifyResetPass,
  ResetPassword,
} = require("../controller/Auth.Controller");
const {
  SignUpValidator,
  LoginValidator,
} = require("../validators/AuthValidate");

const Router = express.Router();

Router.route("/signup").post(SignUpValidator, SignUp);
Router.route("/login").post(LoginValidator, Login);
Router.route("/forgetPassword").post(ForgetPassowrd);
Router.route("/resetcode").post(VerifyResetPass);
Router.route("/resetpassword").put(ResetPassword);

module.exports = Router;
