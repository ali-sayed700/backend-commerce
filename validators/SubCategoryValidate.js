const slugify = require("slugify");
const { check, body } = require("express-validator");
const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

exports.GetSubCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 2 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 33 })
    .withMessage("too long Subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("category must be belong to  subcategory ")
    .isMongoId()
    .withMessage("invalid category id format "),
  ValidatorMiddleWare,
];

exports.UpdateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  ValidatorMiddleWare,
];
exports.DeleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];
