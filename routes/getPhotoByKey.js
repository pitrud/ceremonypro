const AWS = require("aws-sdk");
const express = require("express");
const User = require("../models/User");
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ACCESS,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

router.get("/check-url/:url(*)", async (req, res) => {
  const url = req.params.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  const user = await User.findOne({ randomUrl: url }).select(
    "hisName herName weddingDate"
  );

  if (!user || user.length === 0) {
    return res.status(404).json({ error: "User not found for this URL." });
  }

  res.json(user);
});

router.get("/:key(*)", async (req, res) => {
  // Using '*' to capture full path including slashes
  const photoKey = req.params.key;

  if (!photoKey) {
    return res.status(400).json({ error: "Photo key is required." });
  }

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: photoKey,
  };

  try {
    const s3Object = s3.getObject(params);

    const headObjectPromise = s3.headObject(params).promise();
    const headObject = await headObjectPromise;

    res.set("Content-Type", headObject.ContentType);
    res.set(
      "Content-Disposition",
      `inline; filename="${photoKey.split("/").pop()}"`
    );

    s3Object
      .createReadStream()
      .on("error", (streamErr) => {
        res.status(500).json({ error: "Failed to stream photo." });
      })
      .pipe(res);
  } catch (error) {
    if (error.code === "NoSuchKey") {
      res.status(404).json({ error: "Photo not found." });
    } else {
      res
        .status(500)
        .json({ error: error.message || "Error retrieving photo." });
    }
  }
});

module.exports = router;
