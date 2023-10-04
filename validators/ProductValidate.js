const { check, body } = require("express-validator");
const slugify = require("slugify");

const ValidatorMiddleWare = require("../middlewares/ValidatorMiddleWare");
const CateModel = require("../model/Category.Model");
const SubCategoryModel = require("../model/SubCategory.Model");

exports.GetProductValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreateProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage(" must be at least 3 chars")
    .notEmpty()
    .withMessage(" must title require")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("must description require")
    .isLength({ max: 2000 })
    .withMessage(" too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is require")
    .isNumeric()
    .withMessage("product quantity must be number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be number"),
  check("price")
    .notEmpty()
    .withMessage("product price must be require ")
    .isNumeric()
    .withMessage("product price must be number")
    .isLength({ max: 32 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("priceAfterDiscount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("product color must be in array string"),
  check("imageCover").notEmpty().withMessage("imageCover must be require"),
  check("images")
    .optional()
    .isArray()
    .withMessage("product images must be in array string"),
  check("category")
    .notEmpty()
    .withMessage("product must belong to category")
    .isMongoId()
    .withMessage("invalid Id format")
    .custom(async (category) => {
      const existingUser = await CateModel.findById(category);
      if (!existingUser) {
        throw new Error(`no category for this ID:- ${category}`);
      }
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("invalid Id format")
    .custom(async (subcategory) => {
      const existingUser = await SubCategoryModel.find({
        _id: { $exists: true, $in: subcategory },
      });
      if (existingUser.length < 1) {
        throw new Error(`invalid subcategories ID`);
      }
    })
    .custom(async (val, { req }) => {
      const AllSubCategory = await SubCategoryModel.find({
        category: req.body.category,
      });
      const SubCategoryId = [];
      AllSubCategory.forEach((sub) => {
        SubCategoryId.push(sub._id.toString());
      });

      if (typeof val === "string") {
        if (!SubCategoryId.includes(val)) {
          throw new Error(` subcategories not belong categories`);
        }
      } else if (!val.every((v) => SubCategoryId.includes(v))) {
        throw new Error(` subcategories not belong categories`);
      }
    }),
  check("brand").optional().isMongoId().withMessage("invalid Id format"),
  check("ratingsAverg")
    .optional()

    .isNumeric()
    .withMessage(" product ratingsAverg must be number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1.0")
    .isLength({ max: 4 })
    .withMessage("rating must be below or equal 4.0"),
  check("ratingsQuantity")
    .optional()

    .isNumeric()
    .withMessage(" product ratingsAverg must be number"),

  ValidatorMiddleWare,
];

exports.UpdateProductValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ValidatorMiddleWare,
];
exports.DeleteProductValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];
