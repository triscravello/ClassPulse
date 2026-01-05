const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require("../services/authService");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    const result = await authService.signup(name, email, password);

    return res.status(201).json({
      ...result,
      message: "Signup successful"
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {   // fixed logical OR
      return res.status(400).json({ message: "Email and password required"});
    }

    const result = await authService.login(email, password);

    return res.status(200).json({
      ...result,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during logn" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getProfile };