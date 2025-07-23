const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  registeredAt: { type: Date, default: Date.now },
  randomUrl: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  herName: { type: String, required: false, trim: true },
  hisName: { type: String, required: false, trim: true },
  weddingDate: { type: String, required: false, trim: true },
  isRemoved: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
