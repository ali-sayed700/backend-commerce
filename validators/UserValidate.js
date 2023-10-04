// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const slugify = require("slugify");
const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

const User = require("../model/User.Model");

exports.GetUserValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateUserValidator = [
  check("name")
    .notEmpty()
    .withMessage(" user required")
    .isLength({ min: 3 })
    .withMessage("too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage(" email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const validEmil = await User.findOne({ email: val });

      if (validEmil) {
        return Promise.reject(new Error(`E-mail already is in user`));
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage(" password required")
    .isLength({ min: 6 })
    .withMessage(" password must be at leaset 6 character")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error(`password confirmation is incorrect`);
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number only EG & SA"),
  check("imageProfile").optional(),
  check("role").optional(),
  ValidatorMiddleWare,
];

exports.UpdateUserValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("name")
    .notEmpty() // required or eunique
    .withMessage(" user required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage(" email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const validEmil = await User.findOne({ email: val });

      if (validEmil) {
        return Promise.reject(new Error(`E-mail already is in user`));
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number only EG & SA"),
  check("imageProfile").optional(),
  check("role").optional(),
  ValidatorMiddleWare,
];
exports.UpdateUserPassValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("currentPassowrd")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter password confirmation "),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      // verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const iscorrectPass = await bcrypt.compare(
        req.body.currentPassowrd,
        user.password
      );
      if (!iscorrectPass) {
        throw new Error("incorrect current password");
      }
      //  verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error(`password confirmation is incorrect`);
      }
      return true;
    }),
  ValidatorMiddleWare,
];

// this validate for user

exports.UpdateLoggedUserValidator = [
  body("name")
    .notEmpty() // required or eunique
    .withMessage(" user required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage(" email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const validEmil = await User.findOne({ email: val });

      if (validEmil) {
        return Promise.reject(new Error(`E-mail already is in user`));
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number only EG & SA"),

  ValidatorMiddleWare,
];
exports.DeleteUserValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];
