// services/authService.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup service
const signup = async (name, email, password) => {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(newUser._id);

  return {
    user: { id: newUser._id, name: newUser.name, email: newUser.email },
    token,
  };
};

// Login service
const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) throw new Error("User not found");

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

// Get user profile
const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

module.exports = {
  signup,
  login,
  getProfile,
};