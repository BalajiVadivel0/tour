const Review = require("../models/Review");
const Place = require("../models/Place");
const analyzeReview = require("../utils/sentimentAnalyzer"); // NLP utility

// ✅ Add Review
exports.addReview = async (req, res) => {
  try {
    const { placeId, text, rating } = req.body;
    const userId = req.user.id; // ✅ take user from JWT middleware
    const image = req.file ? req.file.path : null;

    // Analyze review text with NLP (sentiment + aspect keywords)
    const { sentiment, aspects } = analyzeReview(text);

    const review = new Review({
      placeId,
      userId,
      text,
      rating,
      sentiment,
      aspects,
      image
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

// ✅ Get Reviews by Place ID
exports.getReviewsByPlace = async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId }).populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// ✅ Get Reviews by Place Name + Sentiment Summary
exports.getReviewsByPlaceName = async (req, res) => {
  try {
    const placeName = req.query.name;
    if (!placeName) return res.status(400).json({ message: "Place name is required" });

    const place = await Place.findOne({ name: { $regex: new RegExp(placeName, "i") } });
    if (!place) return res.status(404).json({ message: "Place not found" });

    const reviews = await Review.find({ placeId: place._id }).populate("userId", "name");

    // 🔥 Sentiment summary
    let positive = 0, negative = 0, neutral = 0;
    reviews.forEach(r => {
      if (r.sentiment === "Positive") positive++;
      else if (r.sentiment === "Negative") negative++;
      else neutral++;
    });

    const total = reviews.length || 1; // avoid division by zero
    const summary = {
      totalReviews: reviews.length,
      positive,
      negative,
      neutral,
      percentages: {
        positive: ((positive / total) * 100).toFixed(1) + "%",
        negative: ((negative / total) * 100).toFixed(1) + "%",
        neutral: ((neutral / total) * 100).toFixed(1) + "%"
      }
    };

    res.json({
      place: place.name,
      summary,
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews by place name", error: err.message });
  }
};
