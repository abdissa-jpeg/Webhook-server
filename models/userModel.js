const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email should be unique"],
      minlength: [5, "email should be atleast 5 characters long"],
      maxlength: [255, "email should have less than 255 characters"],
      email: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 5,
      maxlength: 1024,
    },
    role: {
      type: String,
      required: true,
      enum: ["talent", "admin", "company", "superadmin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { strict: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
