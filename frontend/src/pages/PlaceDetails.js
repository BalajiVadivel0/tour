import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ReviewForm from "../components/ReviewForm";

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"
});

// ✅ Your OpenTripMap API Key
const OPENTRIPMAP_API_KEY = "5ae2e3f221c38a28845f05b68d340359b87dc2abe31b800f212b011e";

export default function PlaceDetails() {
  const { name } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        // First, get place details from your backend
        const res = await API.get(`/places/search/full?name=${name}`);
        let placeData = res.data;

        // Then, get more details from OpenTripMap
        const otmRes = await fetch(
          `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
            name
          )}&apikey=${OPENTRIPMAP_API_KEY}`
        );
        const otmData = await otmRes.json();

        if (otmData && otmData.lat && otmData.lon) {
          placeData = {
            ...placeData,
            location: {
              lat: otmData.lat,
              lng: otmData.lon,
              city: otmData.name,
              country: otmData.country
            },
            description: placeData.description || otmData.wiki_extracts?.text || "No description available."
          };
        }

        setPlace(placeData);
      } catch (err) {
        console.error("Error fetching place details:", err);
      }
    };
    fetchPlace();
  }, [name]);

  if (!place) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];
  const sentimentData = [
    { name: "Positive", value: place.summary?.positive || 0 },
    { name: "Negative", value: place.summary?.negative || 0 },
    { name: "Neutral", value: place.summary?.neutral || 0 }
  ];

  // Label with percentage
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* Title */}
      <Typography variant="h3" gutterBottom fontWeight="bold">
        {place.name}
      </Typography>

      {/* Images */}
      <Grid container spacing={2}>
        {place.images?.length > 0 ? (
          place.images.map((img, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 4 }}>
                <CardMedia component="img" height="200" image={img} alt={place.name} />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ mt: 2, ml: 2 }}>No images available.</Typography>
        )}
      </Grid>

      {/* Description */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Description</Typography>
      <Typography variant="body1">{place.description}</Typography>

      {/* Weather */}
      {place.weather && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">🌦️ Weather Info</Typography>
          <Typography>
            {place.weather.temp}°C (Feels like {place.weather.feels_like}°C), {place.weather.condition}
          </Typography>
        </Box>
      )}

      {/* Map */}
      {place.location && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📍 Location</Typography>
          <MapContainer
            center={[place.location.lat, place.location.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%", marginTop: "10px", borderRadius: "12px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[place.location.lat, place.location.lng]}>
              <Popup>{place.name}</Popup>
            </Marker>
          </MapContainer>
        </Box>
      )}

      {/* Sentiment Analysis */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>📊 Sentiment Analysis</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <PieChart width={400} height={300}>
          <Pie
            data={sentimentData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderCustomizedLabel}
          >
            {sentimentData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>

      {/* Reviews */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>📝 Reviews</Typography>
      {place.reviews?.length > 0 ? (
        place.reviews.map((r, i) => (
          <Card key={i} sx={{ mt: 2, boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1"><b>{r.userId?.name}</b></Typography>
              <Typography variant="body1">{r.text}</Typography>
              <Typography variant="body2" color="text.secondary">
                ⭐ {r.rating} | Sentiment: {r.sentiment}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography sx={{ mt: 2 }}>No reviews yet. Be the first to review!</Typography>
      )}

      {/* Review Form */}
      <ReviewForm placeId={place._id} />
    </Container>
  );
}
