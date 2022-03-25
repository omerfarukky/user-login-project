const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    full_name: String,
    password: String,
    active: Boolean,
    email: {
      type: String,
      unique: true,
    },
    activatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
