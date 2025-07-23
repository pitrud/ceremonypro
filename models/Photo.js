const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  photoUrl: { type: String },
  smallThumbnailUrl: { type: String },
  mediumThumbnailUrl: { type: String },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo; 