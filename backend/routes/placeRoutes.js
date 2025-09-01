const express = require("express");
const multer = require("multer");
const { 
  addPlace, 
  getPlaces, 
  getPlaceById, 
  searchPlaceFull  // ✅ use the upgraded full search API
} = require("../controllers/placeController");

const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post("/", upload.array("images", 5), addPlace);
router.get("/", getPlaces);

// 🔥 Full search API (includes Wikipedia, Unsplash, OSM, Weather, Reviews)
router.get("/search/full", searchPlaceFull);

router.get("/:id", getPlaceById);

module.exports = router;
