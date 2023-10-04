const asyncHandler = require("express-async-handler");
const CartModel = require("../model/Cart.Model");
const ProductModel = require("../model/Product.Model");
const CouponModel = require("../model/Coupon.Model");
const ApiError = require("../utility/ApiError");

const CalcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItem.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.PostCart = asyncHandler(async (req, res, next) => {
  const { prodcutId, color } = req.body;
  const product = await ProductModel.findById(prodcutId);
  let cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItem: [{ product: prodcutId, color, price: product.price }],
    });
  } else {
    //   product exxist in cart , update product quantity
    const productIndex = cart.cartItem.findIndex(
      (item) => item.product.toString() === prodcutId && item.color === color
    );

    if (productIndex > -1) {
      const itemCart = cart.cartItem[productIndex];
      itemCart.quantity += 1;
      cart.cartItem[productIndex] = itemCart;
    } else {
      // prodcut not exist in cart , push to cartitem in arr
      cart.cartItem.push({ product: prodcutId, color, price: product.price });
    }
  }
  //   calculate total cart price
  CalcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product added to cart successfully",
    data: cart,
  });
});

exports.GetCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`there is no cart`, 404));
  }
  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItem.length,
    data: cart,
  });
});

exports.RemoveCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItem: { _id: req.params.cartId } } },
    { new: true }
  );

  CalcTotalPrice(cart);
  await cart.save();
  res.status(204).json({
    status: "success",
    numOfCartItem: cart.cartItem.length,
    data: cart,
  });
});

exports.RemoveAllCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

exports.UpdateCart = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this ${req.params.cartId}`, 404)
    );
  }

  const productIndex = cart.cartItem.findIndex(
    (item) => item._id.toString() === req.params.cartId
  );

  if (productIndex > -1) {
    const itemCart = cart.cartItem[productIndex];
    itemCart.quantity = quantity;
    cart.cartItem[productIndex] = itemCart;
  } else {
    return next(
      new ApiError(`there is no cart for this ${req.params.cartId}`, 404)
    );
  }
  CalcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItem.length,
    data: cart,
  });
});

exports.ApplyCoupon = asyncHandler(async (req, res, next) => {
  // 1- get coupon based on coupon name
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`coupon is invalid or expired`, 404));
  }
  //  get user cart to get total cart price
  const cart = await CartModel.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDisc = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDisc;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItem.length,
    data: cart,
  });
});
