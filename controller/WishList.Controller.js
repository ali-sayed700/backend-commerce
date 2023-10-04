const asyncHandler = require("express-async-handler");

const User = require("../model/User.Model");

exports.AddProdcutToWhishList = asyncHandler(async (req, res, next) => {
  // addToSet >> add productId to wishlist arr if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,

    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product added to wishlist successfully",
    data: user.wishlist,
  });
});

exports.DeleteProdcutFromWhishList = asyncHandler(async (req, res, next) => {
  // pull >> remove productId to wishlist arr if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,

    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product removed from wishlist successfully",
    data: user.wishlist,
  });
});

exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  // pull >> remove productId to wishlist arr if not exist
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    message: "product removed from wishlist successfully",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
