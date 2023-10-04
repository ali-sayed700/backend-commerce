// eslint-disable-next-line import/no-extraneous-dependencies
// const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const slugify = require("slugify");
const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

const User = require("../model/User.Model");

exports.SignUpValidator = [
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

  ValidatorMiddleWare,
];

exports.LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage(" email required")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage(" password required")
    .isLength({ min: 6 })
    .withMessage(" password must be at leaset 6 character"),
  ValidatorMiddleWare,
];
