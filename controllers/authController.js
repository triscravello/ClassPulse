const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require("../services/authService");

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // Extract user from result 
    const user = result.user;
    const token = generateToken(user);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email, 
        role: user.role
      },
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

    // Call authService.login directly
    const result = await authService.login(email, password);

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    // Respond with token and user
    return res.status(200).json({
      user: result.user,
      token: result.token,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    if (user.error) {
      return res.status(404).json({ message: user.error });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getProfile };