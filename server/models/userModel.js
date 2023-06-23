const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name!"],
    maxLength: [30, "Name Should Not Exceed 30 Characters!"],
    minLength: [4, "Name Should Be Greater Than 4 Characters!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Email!"],
    validate: [validator.isEmail, "Please Enter Valid Email!"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password!"],
    minLength: [8, "Password Length Should Be Greater Than 8 Characters!"],
    select: false,
    validate: [validator.isStrongPassword, "Please Enter Strong Password!"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "User",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.comparePassword = function (userPassword) {
  const passwordMatched = bcrypt.compare(userPassword, this.password);
  return passwordMatched;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha512")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
