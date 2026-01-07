const express = require('express');
const { getAllStudents, createStudent, getStudent, updateStudent, removeStudent } = require('../controllers/studentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Apply 'protect' to all routes that require authentication
router.use(protect);

// GET /classes/:classId/students
router.get("/", getAllStudents);

// POST /classes/:classId/students
router.post("/", createStudent);

// GET /classes/:classId/students/:studentId
router.get("/:studentId", getStudent);

// PUT /classes/:classId/students/:studentId
router.put("/:studentId", updateStudent);

// DELETE /classes/:classId/students/:studentId
router.delete("/:studentId", removeStudent);

module.exports = router;