const { check } = require("express-validator");
const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");

const ProductModel = require("../model/Product.Model");

exports.VaildateToWishList = [
  check("productId")
    .isMongoId()
    .withMessage("Not a valid id ...")
    .custom(async (val, { req }) => {
      const product = await ProductModel.findById(val);
      if (!product) {
        throw new Error(`there is no product on this ID :- ${val}`);
      }

      return true;
    }),
  ValidatorMiddleWare,
];

exports.DelVaildateFromWishList = [
  check("productId").isMongoId().withMessage("Not a valid id ..."),
  ValidatorMiddleWare,
];
