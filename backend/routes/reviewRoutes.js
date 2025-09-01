const express = require("express");
const multer = require("multer");
const { addReview, getReviewsByPlace, getReviewsByPlaceName } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer for optional image uploads in reviews
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reviews/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Add a review (protected, only logged-in users)
router.post("/", authMiddleware, upload.single("image"), addReview);

// ✅ Get reviews by place name + sentiment summary (specific route comes first)
router.get("/search/by-name", getReviewsByPlaceName);

// ✅ Get reviews by placeId
router.get("/:placeId", getReviewsByPlace);

module.exports = router;
