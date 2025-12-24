const express = require('express');
const { getClasses, createClass, getClassById, updateClass, removeClass } = require("../controllers/classController");
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply 'protect' to all routes that require authentication
router.use(protect);

// GET /classes
router.get("/", getClasses);

// POST /classes
router.post("/", createClass);

// GET /classes/:id
router.get("/:id", getClassById);

// PUT /classes/:id
router.put("/:id", updateClass);

// DELETE /classes/:id
router.delete("/:id", removeClass);

module.exports = router;