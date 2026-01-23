const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup service
const signup = async (name, email, password) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return { error: "User already exists" };
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password, // let the model hash it once, not twice
    role: "teacher", // default role if needed
  });

  const token = generateToken(newUser._id);

  return {
    user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    token,
  };
};

// Login service
const login = async (email, password) => {
  if (!email || !password) return { error: "Email and password are required" };

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) return { error: "User not found" };
  if (!user.password) return { error: "Password not set for this user" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: "Invalid credentials" };

  const token = generateToken(user._id);

  // Always include role for frontend
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role || "teacher" },
    token,
  };
};

// Get user profile
const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return { error: "User not found" };
  return user;
};

module.exports = { signup, login, getProfile };