// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/UploadImageMiddleware");

const User = require("../model/User.Model");

const { DeleteOne, CreateOne, GetOne, GetAll } = require("./HandlerFactory");

const ApiError = require("../utility/ApiError");

const createToken = require("../utility/CreateToken");

// upload single images
exports.UploadUserImage = uploadSingleImage("imageProfile");

// // memory storage engine
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/users/${filename}`);
    // save images in db
    req.body.imageProfile = filename;
  }
  next();
});

// # Get All data
exports.GetUser = GetAll(User);

// # Get one  data by id
exports.GetOneUser = GetOne(User);
// # Post data to database

exports.PostUser = CreateOne(User);

// # Update data to database
exports.UpdateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      imageProfile: req.body.imageProfile,
      role: req.body.role,
    },
    { new: true } // to back users after update not before
  );
  if (!document) {
    // res.status(404).json({ msg: `no category for this ${id}` });
    return next(new ApiError(`no ${document} for this ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// change password to database
exports.UpdateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    { new: true } // to back users after update not before
  );
  if (!document) {
    // res.status(404).json({ msg: `no category for this ${id}` });
    return next(new ApiError(`no ${document} for this ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// # delete data to database

exports.DeleteUser = DeleteOne(User);

// # get user data
exports.GetLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// # update password user data
exports.UpdatePasswordUser = asyncHandler(async (req, res, next) => {
  // update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    { new: true } // to back users after update not before
  );
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// # update logged user data
exports.UpdateLoggedUser = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true } // to back users after update not before
  );
  res.status(200).json({ data: updateUser });
});
//  delete logged  user
exports.DeleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success", message: "asdasdas" });
});

// for studying
// const slugify = require("slugify");

// const asyncHandler = require("express-async-handler");
// const BrandModel = require("../model/Brand.Model");

// const ApiError = require("../utility/ApiError");
// const ApiFeature = require("../utility/ApiFeatures");
// // # Get All data
// exports.GetBrand = asyncHandler(async (req, res) => {
//   // http://localhost:8000/api/v1/categories?page=1&limit=4
//   // this link is related in (re.query)
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;
//   // const brand = await BrandModel.find({}).skip(skip).limit(limit);

//   const countDocument = await BrandModel.countDocuments();
//   const ApiFeatures = new ApiFeature(BrandModel.find(), req.query)
//     .filter()
//     .search()
//     .paginate(countDocument)
//     .sort()
//     .limitFields();

//   const { mongooseQuery, paginationResult } = ApiFeatures;
//   const brand = await mongooseQuery;
//   res
//     .status(200)
//     .json({ results: brand.length, paginationResult, data: brand });
// });

// // # Get one  data by id
// exports.GetOneBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await BrandModel.findById(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

// // # Post data to database

// exports.PostBrand = asyncHandler(async (req, res) => {
//   const { name } = req.body;

//   const brand = await BrandModel.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: brand });
// });

// // # Update data to database
// exports.UpdateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const brand = await BrandModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true } // to back category after update not before
//   );
//   if (!brand) {
//     // res.status(404).json({ msg: `no category for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });
// // # delete data to database

// exports.DeleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await BrandModel.findByIdAndDelete(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this ${id}` });
//     return next(new ApiError(`no brand for this ${id}`, 404));
//   }
//   res.status(204).send();
// });
