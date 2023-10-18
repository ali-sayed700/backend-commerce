const { check } = require("express-validator");

const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

const Reviews = require("../model/Reviews.Model");

exports.GetReviewValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating value required")
    .isFloat()
    .withMessage("rating value must be 1 - 5"),
  check("user").isMongoId().withMessage("Not a valid id"),
  check("product")
    .isMongoId()
    .withMessage("Not a valid id")
    // validate if review created or not
    .custom(async (val, { req }) => {
      // console.log(req);
      const review = await Reviews.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (review)
        return Promise.reject(new Error("you already created review before"));
    }),
  ValidatorMiddleWare,
];

exports.UpdateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Not a valid id")
    .custom(async (val, { req }) => {
      const review = await Reviews.findById(val);
      if (!review) {
        return Promise.reject(new Error(`no review with this ${review}`));
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`you aren't allow to perform this action`)
        );
      }
    }),

  ValidatorMiddleWare,
];
exports.DeleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Not a valid id")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Reviews.findById(val);
        if (!review) {
          return Promise.reject(new Error(`no review with this ${review}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`you aren't allow to perform this action`)
          );
        }
      }
    }),
  ValidatorMiddleWare,
];
