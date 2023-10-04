const CouponModel = require("../model/Coupon.Model");

const {
  DeleteOne,
  UpdateOne,
  CreateOne,
  GetOne,
  GetAll,
} = require("./HandlerFactory");

// # Get All data
exports.GetCoupon = GetAll(CouponModel);

// # Get one  data by id
exports.GetOneCoupon = GetOne(CouponModel);
// # Post data to database

exports.PostCoupon = CreateOne(CouponModel);

// # Update data to database
exports.UpdateCoupon = UpdateOne(CouponModel);
// # delete data to database

exports.DeleteCoupon = DeleteOne(CouponModel);
