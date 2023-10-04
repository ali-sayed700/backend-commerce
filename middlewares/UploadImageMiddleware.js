const multer = require("multer");
const ApiError = require("../utility/ApiError");

function MlterOperations() {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only image allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
}

exports.uploadSingleImage = (fieldName) => MlterOperations().single(fieldName);

exports.uploadMixImages = (arrName) => MlterOperations().fields(arrName);

// exports.UploadSingleImage = (fieldName) => {
//   const multerStorage = multer.memoryStorage();

//   const multerFilter = function (req, file, cb) {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new ApiError("only image allowed", 400), false);
//     }
//   };
//   const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//   return upload.single(fieldName);
// };

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("only image allowed", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// image that find in modelSchema
// exports.UploadCategoryImage = upload.single("image");
