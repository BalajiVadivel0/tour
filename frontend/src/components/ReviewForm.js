import React, { useState } from "react";
import API from "../services/api";
import {
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

export default function ReviewForm({ placeId }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!text.trim()) {
      alert("Please write a review before submitting!");
      return;
    }

    const formData = new FormData();
    formData.append("placeId", placeId);
    formData.append("text", text);
    formData.append("rating", rating);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await API.post("/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Review added successfully!");
      window.location.reload();
    } catch (err) {
      alert("⚠️ Login required to add a review!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 4, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ✍️ Share Your Experience
        </Typography>

        {/* Review Text */}
        <TextField
          label="Write your review"
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Rating */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Your Rating:</Typography>
          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
            size="large"
          />
        </Box>

        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          {image && (
            <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
              {image.name}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
}
