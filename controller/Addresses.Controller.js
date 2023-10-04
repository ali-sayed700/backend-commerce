const asyncHandler = require("express-async-handler");

const User = require("../model/User.Model");

exports.AddAddress = asyncHandler(async (req, res, next) => {
  // addToSet >> add address to addresses arr if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,

    { $addToSet: { addresses: req.body } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address added  successfully",
    data: user.addresses,
  });
});

exports.DeleteAddress = asyncHandler(async (req, res, next) => {
  // pull >> remove addressId to addresses arr if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,

    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address removed  successfully",
    data: user.addresses,
  });
});

exports.getLoggedUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    message: "get  addresses  successfully",
    result: user.addresses.length,
    data: user.addresses,
  });
});
