const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/User.Model");
const ApiError = require("../utility/ApiError");

const sendEmail = require("../utility/SendEmail");

const createToken = require("../utility/CreateToken");

exports.SignUp = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.Login = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email and passsword", 401));
  }
  // generate token

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

exports.Protect = asyncHandler(async (req, res, next) => {
  // 1-check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login , please login ", 401));
  }
  // 2- verify token (no change happens in token , expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3-check if users exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("the user that belong to this token , no longer exist ", 401)
    );
  }
  // 4- check if user change his password after token created
  if (currentUser.passwordChangeAt) {
    const chnageTimeStamps = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );

    if (chnageTimeStamps > decoded.iat) {
      return next(
        new ApiError(
          "user changed his password recently  , please log in again ",
          401
        )
      );
    }
  }
  req.user = currentUser;

  next();
});

//  permission for access
exports.AllowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("you aren't allowed to access to this route ", 403)
      );

    next();
  });

exports.ForgetPassowrd = asyncHandler(async (req, res, next) => {
  // 1- get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(`no user for this email ${req.body.email}`, 404));
  }

  // 2- if user exist , generate hash rest random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const HashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save hashed password reset code in db
  user.passwordResetCode = HashResetCode;
  // add expiration time for password reset code for 10m
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerfied = false;

  await user.save();
  // 3- send the reset code via Email

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code (valid for 10m",
      message: `hi ${user.name} \n we received your request your pass \n ${resetCode} \n`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerfied = undefined;
    await user.save();
    return next(new ApiError(`there is error in sending email `, 500));
  }

  res
    .status(200)
    .json({ status: "successed", message: "reset code sent to email" });
});

exports.VerifyResetPass = asyncHandler(async (req, res, next) => {
  // 1- get user based on reset code

  const HashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // check if reset password is in db & password expire > date.now()
  const user = await User.findOne({
    passwordResetCode: HashResetCode,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(`reset code invalid or expire `, 400));
  }
  // 2- reset code valid
  user.passwordResetVerfied = true;
  await user.save();
  res.status(200).json({ status: "successed" });
});

exports.ResetPassword = asyncHandler(async (req, res, next) => {
  // 1- get user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`there is no user with email ${req.body.email} `, 404)
    );
  }

  // 2- check if  reset code verfied
  if (!user.passwordResetVerfied) {
    return next(new ApiError(`reset code not  verfied `, 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerfied = undefined;
  await user.save();
  // 3- generate new token
  const token = createToken(user._id);

  res.status(200).json({ token });
});
