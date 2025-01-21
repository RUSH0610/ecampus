const mongoose = require("mongoose");
const { type } = require("os");

const emailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailData: { type: String, required: true, unique: true },
  categoryId: {
    type: String,
    required: true,
  },
  categoryName: { type: String, required: true },
});

module.exports = mongoose.model("Email", emailSchema);
