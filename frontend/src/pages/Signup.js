import React, { useState } from "react";
import API from "../services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    try {
      await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      alert("✅ Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("⚠️ Signup failed: " + err.response?.data?.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%" }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "#1e1e2f",
            color: "white",
            boxShadow: 6
          }}
        >
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              ✨ Sign Up
            </Typography>
            <TextField
              label="Name"
              name="name"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#aaa" } }}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#aaa" } }}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#aaa" } }}
              onChange={handleChange}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, input: { color: "white" }, label: { color: "#aaa" } }}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#ff4081", "&:hover": { bgcolor: "#f50057" } }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <span
                style={{ color: "#ff4081", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}
