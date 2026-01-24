const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("value is invalid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about for the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Jwt@keytokeepsecure", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
