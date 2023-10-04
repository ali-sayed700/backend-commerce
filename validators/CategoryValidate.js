const { check, body } = require("express-validator");
const slugify = require("slugify");

const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

exports.GetCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateCategoryValidator = [
  check("name")
    .notEmpty() // required or eunique
    .withMessage(" category required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 33 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ValidatorMiddleWare,
];

exports.UpdateCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("name")
       .notEmpty() // required or eunique
    .withMessage(" category required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ValidatorMiddleWare,
];
exports.DeleteCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];
