import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 5,
        py: 3,
        textAlign: "center",
        bgcolor: "#0d1b2a",
        color: "white",
      }}
    >
      {/* Branding */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        🌍 TourInsight
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Discover the world’s best tourist places with reviews, weather, and more.
      </Typography>

      {/* Navigation Links */}
      <Typography variant="body2">
        <Link href="/" color="inherit" underline="hover" sx={{ mx: 1 }}>
          Home
        </Link>
        <Link href="/about" color="inherit" underline="hover" sx={{ mx: 1 }}>
          About
        </Link>
        <Link href="/contact" color="inherit" underline="hover" sx={{ mx: 1 }}>
          Contact
        </Link>
      </Typography>

      {/* Copyright */}
      <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
        © {new Date().getFullYear()} TourInsight. All rights reserved.
      </Typography>
    </Box>
  );
}
