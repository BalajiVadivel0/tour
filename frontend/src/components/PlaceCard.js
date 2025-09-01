import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Grid,
  Chip,
  Box
} from "@mui/material";
import { Link } from "react-router-dom";

export default function PlaceCard({ place }) {
  return (
    <Card
      sx={{
        mt: 4,
        boxShadow: 6,
        borderRadius: 4,
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.02)", boxShadow: 10 }
      }}
    >
      {/* Image Gallery (horizontal scroll) */}
      {place.images?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            p: 2,
            bgcolor: "#fafafa"
          }}
        >
          {place.images.slice(0, 3).map((img, idx) => (
            <CardMedia
              key={idx}
              component="img"
              image={img}
              alt={place.name}
              sx={{
                height: 200,
                width: 300,
                borderRadius: 2,
                objectFit: "cover"
              }}
            />
          ))}
        </Box>
      )}

      <CardContent>
        {/* Place Name */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {place.name}
        </Typography>

        {/* Location */}
        {place.location?.displayName && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            📍 {place.location.displayName}
          </Typography>
        )}

        {/* Weather Info */}
        {place.weather && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`🌡️ ${place.weather.temp}°C, ${place.weather.condition}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Description */}
        <Typography variant="body1" sx={{ mt: 1 }}>
          {place.description?.slice(0, 200) || "No description available."}...
        </Typography>

        {/* View More Button */}
        <Button
          component={Link}
          to={`/place/${encodeURIComponent(place.name)}`}
          variant="contained"
          sx={{ mt: 3 }}
        >
          View More
        </Button>
      </CardContent>
    </Card>
  );
}
