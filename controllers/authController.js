const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Signup
const signup = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const newUser = await User.create({ name: name.trim(), email: normalizedEmail, password });

    // Issue JWT
    const token = generateToken(newUser._id);

    return res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token,
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

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) 
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getProfile };