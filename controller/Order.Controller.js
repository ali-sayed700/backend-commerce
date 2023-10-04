const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utility/ApiError");
const OrderModel = require("../model/Order.Model");
const CartModel = require("../model/Cart.Model");
const ProductModel = require("../model/Product.Model");
const { GetOne, GetAll } = require("./HandlerFactory");

exports.CreateCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shoppingPrice = 0;
  // 1- get cart depend on cartID
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart on this ID ${req.params.cartId}`, 404)
    );
  }
  // 2- get order price depend on cart price "check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shoppingPrice;
  // 3- create order with default payment method type cash
  const order = OrderModel.create({
    user: req.user._id,
    cartItem: cart.cartItem,
    shoppingAddress: req.body.shoppingAddress,
    totalOrderPrice,
  });
  // 4- after creating order , decreement product quantity , increement product sold
  if (order) {
    const bulkOption = await cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { qunatity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOption, {});
    // 5- clear cart depend on cartId
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(200).json({ status: "success", data: order });
});

exports.createFilterObj = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
};
exports.GetAllOrders = GetAll(OrderModel);
exports.GetOneOrder = GetOne(OrderModel);

exports.UpdateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`there is no order on this ID ${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const UpdatePaid = await order.save();
  res.status(200).json({ status: "success", data: UpdatePaid });
});

exports.UpdateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`there is no order on this ID ${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const UpdateDelivered = await order.save();
  res.status(200).json({ status: "success", data: UpdateDelivered });
});

// get checkout session from stripe and send it as response

exports.CheckOutSession = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shoppingPrice = 0;
  // 1- get cart depend on cartID
  const cart = await CartModel.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`there is no cart on this ID ${req.params.cartId}`, 404)
    );
  }
  // 2- get order price depend on cart price "check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shoppingPrice;

  // 3- create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // name: req.user.name,
        // amount: totalOrderPrice * 100,
        // currency: "egp",
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },

          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shoppingAddress,
  });

  // 4- send session to respone
  res.status(200).json({ status: "success", session });
});
