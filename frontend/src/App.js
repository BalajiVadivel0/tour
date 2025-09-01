import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlaceDetails from "./pages/PlaceDetails";
import Navbar from "./components/Navbar";   // ✅ separate component
import Footer from "./components/Footer";   // ✅ new footer

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />  {/* ✅ top navigation bar */}
      <Container sx={{ mt: 3, minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/place/:name" element={<PlaceDetails />} />
        </Routes>
      </Container>
      <Footer />  {/* ✅ footer at bottom */}
    </Router>
  );
}

export default App;
