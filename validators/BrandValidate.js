const { check, body } = require("express-validator");
const slugify = require("slugify");
const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

exports.GetBrandValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage(" Brand required")
    .isLength({ min: 3 })
    .withMessage("too short Brand name")
    .isLength({ max: 33 })
    .withMessage("too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ValidatorMiddleWare,
];

exports.UpdateBrandValidator = [
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
exports.DeleteBrandValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];
