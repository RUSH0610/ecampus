const mongoose = require("mongoose");

const authUser = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  admincode: { type: String },
});

module.exports = mongoose.model("User", authUser);
