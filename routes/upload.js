const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const Sharp = require("sharp");
const Photo = require("../models/Photo");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ACCESS,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("*", upload.array("photos", 10), async (req, res) => {
  try {
    const uploadedPhotos = [];

    for (const file of req.files) {
      const fileName = `photos/${Date.now()}_${file.originalname}`;

      const smallThumbnail = await Sharp(file.buffer).resize(200).toBuffer();
      const mediumThumbnail = await Sharp(file.buffer).resize(500).toBuffer();

      const photoUpload = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      const smallUpload = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `thumbnails/small-${fileName}`,
          Body: smallThumbnail,
          ContentType: "image/jpeg",
        })
        .promise();

      const mediumUpload = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `thumbnails/medium-${fileName}`,
          Body: mediumThumbnail,
          ContentType: "image/jpeg",
        })
        .promise();

      const photo = new Photo({
        uid: req.user.uid,
        photoUrl: photoUpload.Key,
        smallThumbnailUrl: smallUpload.Key,
        mediumThumbnailUrl: mediumUpload.Key,
      });

      await photo.save();

      uploadedPhotos.push({
        photoUrl: photoUpload.Key,
        smallThumbnailUrl: smallUpload.Key,
        mediumThumbnailUrl: mediumUpload.Key,
      });
    }

    res.json({ urls: uploadedPhotos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
