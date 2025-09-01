import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <AppBar
      position="sticky"
      sx={{ background: "linear-gradient(90deg, #1a73e8, #1976d2)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          🌍 TourInsight
        </Typography>

        {/* Links / Buttons */}
        <Box>
          {!token ? (
            <>
              <Button color="inherit" href="/login" sx={{ mx: 1 }}>
                Login
              </Button>
              <Button
                color="secondary"
                variant="contained"
                href="/signup"
                sx={{ mx: 1, fontWeight: "bold" }}
              >
                Signup
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ mx: 1, fontWeight: "bold" }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
