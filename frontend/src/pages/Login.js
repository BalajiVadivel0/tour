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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      alert("⚠️ Login failed: " + err.response?.data?.message);
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
              🔑 Login
            </Typography>
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
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#ff4081", "&:hover": { bgcolor: "#f50057" } }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Typography align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <span
                style={{ color: "#ff4081", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}
