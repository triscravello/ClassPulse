const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

// GET /auth/me
router.get("/me", protect, getProfile);

module.exports = router;