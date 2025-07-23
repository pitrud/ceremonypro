const mongoose = require('mongoose');

const removalRequestSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  requestedAt: { type: Date, default: Date.now },
});

const RemovalRequest = mongoose.model('RemovalRequest', removalRequestSchema);

module.exports = RemovalRequest; 