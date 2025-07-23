const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");

function generateRandomUrl() {
  return `${crypto.randomBytes(8).toString("hex")}`;
}

router.post("/", async (req, res) => {
  const { uid, email } = req.user;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      let randomUrl;
      let isUnique = false;

      while (!isUnique) {
        randomUrl = generateRandomUrl();
        const existing = await User.findOne({ randomUrl });
        if (!existing) isUnique = true;
      }

      user = new User({
        uid,
        randomUrl,
        email,
        username: email ? email.split("@")[0] : `you`,
      });

      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
