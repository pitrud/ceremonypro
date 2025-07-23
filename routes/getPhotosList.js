const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");
const RemovalRequest = require("../models/RemovalRequest");
const User = require("../models/User");
const Purchase = require("../models/Purchase");

router.get("/list", async (req, res) => {
  const { uid } = req.user;

  try {
    const photos = await Photo.find({ uid: uid })
      .sort({ uploadedAt: -1 })
      .select("photoUrl smallThumbnailUrl mediumThumbnailUrl uploadedAt");

    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/info", async (req, res) => {
  const { uid } = req.user;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const totalPhotos = await Photo.countDocuments({ uid: uid });

  const recentPhotos = await Photo.countDocuments({
    uid: uid,
    uploadedAt: { $gte: yesterday },
  });

  res.json({
    totalPhotos,
    recentPhotos,
  });
});

router.post("/update-wedding-info", async (req, res) => {
  const { uid } = req.user;

  const { herName, hisName, weddingDate } = req.body;
  const updatedUser = await User.findOneAndUpdate(
    { uid },
    { $set: { herName, hisName, weddingDate } },
    { new: true }
  );

  res.json(updatedUser);
});

router.post("/save-purchase", async (req, res) => {
  const { uid, currentPurchase } = req.body;

  try {
    const purchase = await Purchase.create({
      uid,
      productId: currentPurchase.productId,
      transactionId: currentPurchase.transactionId,
      purchaseTime: new Date(currentPurchase.purchaseTime),
      purchaseToken: currentPurchase.purchaseToken,
      quantity: currentPurchase.quantity || 1,
      isAcknowledged: currentPurchase.isAcknowledged || false,
      metadata: currentPurchase,
    });

    res.status(201).json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving purchase" });
  }
});

router.post("/remove-account", async (req, res) => {
  const { uid } = req.user;
  if (!uid) return res.status(400).json({ error: "Missing UID" });

  const removalRequest = new RemovalRequest({
    uid,
  });

  await removalRequest.save();

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isRemoved = true;
    user.uid = `_removed_${user.uid}`;

    await user.save();

    res.status(200).json({ message: "Account marked as removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove account" });
  }

  res.json({
    message: "Removal request submitted successfully",
  });
});

module.exports = router;
