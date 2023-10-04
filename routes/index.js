const CategoryRoute = require("./Category.Route");

const SubCategoryRoute = require("./SubCategory.Route");

const BrandRoute = require("./Brand.Route");

const ProductRoute = require("./Product.Route");

const UserRoute = require("./User.Route");

const Auth = require("./AuthRoute");

const Reviews = require("./Reviews.Route");

const WishList = require("./WishList.Route");
const Address = require("./Address.Route");
const Coupon = require("./Coupon.Route");
const Cart = require("./Cart.Route");
const Order = require("./Order.Route");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", CategoryRoute);
  app.use("/api/v1/subCategories", SubCategoryRoute);
  app.use("/api/v1/brands", BrandRoute);
  app.use("/api/v1/products", ProductRoute);
  app.use("/api/v1/users", UserRoute);
  app.use("/api/v1/auth", Auth);
  app.use("/api/v1/reviews", Reviews);
  app.use("/api/v1/wishlist", WishList);
  app.use("/api/v1/address", Address);
  app.use("/api/v1/coupons", Coupon);
  app.use("/api/v1/carts", Cart);
  app.use("/api/v1/orders", Order);
};

module.exports = mountRoutes;
