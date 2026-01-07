const express = require('express');
const { getClassReport, getStudentReport, exportReport } = require('../../controllers/reportController');
const protect = require('../../middleware/authMiddleware');
const router = express.Router();

// GET /reports/class/:classId
router.get('/class/:classId', protect, getClassReport);

// GET /reports/student/:studentId
router.get('/student/:studentId', protect, getStudentReport);

// GET /reports/export
router.get('/export', protect, exportReport);

module.exports = router;