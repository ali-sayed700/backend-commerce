// # mongoose
const mongoose = require("mongoose");
// # Schema
const { Schema } = mongoose;

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

// # creating schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "name"],
      trim: true,
    },
    // A and B >> www.shop.com/(a-and-b)
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      require: [true, "name"],
      unique: [true, "email must be unique"],
      index: [true, "index must be exist"],
      trim: true,
    },
    phone: String,
    imageProfile: String,
    password: {
      type: String,
      require: [true, "password required"],
      minlength: [6, "too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerfied: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference one to many
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Types.ObjectId },
        alias: "String",
        details: "String",
        phone: "String",
        city: "String",
        postalCode: "String",
      },
    ],
  },
  { timestamps: true } // create creatAt and  updateAt
);

const imageUrl = (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/users/${doc.image}`;
    doc.image = imgUrl;
  }
};
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.post("init", (doc) => imageUrl(doc));

UserSchema.post("save", (doc) => imageUrl(doc));
// # model of schema
const User = mongoose.model("User", UserSchema);
// CateModel.createIndexes();
module.exports = User;
