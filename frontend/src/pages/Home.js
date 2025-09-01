import React, { useState } from "react";
import API from "../services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import PlaceCard from "../components/PlaceCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchPlace = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/places/search/full?name=${query}`);
      setPlace(res.data);
    } catch (err) {
      console.error("Error fetching place:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box sx={{ bgcolor: "rgba(0,0,0,0.5)", p: 4, borderRadius: 3 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Discover Your Next Adventure ✈️
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                label="Search a tourist place"
                fullWidth
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ height: "100%" }}
                onClick={searchPlace}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Search Results */}
      <Container sx={{ mt: 4 }}>
        {loading && (
          <CircularProgress sx={{ mt: 4, display: "block", mx: "auto" }} />
        )}
        {place && <PlaceCard place={place} />}
      </Container>
    </>
  );
}
