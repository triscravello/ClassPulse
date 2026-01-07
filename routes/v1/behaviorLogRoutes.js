const express = require('express');
const { getAllBehaviorLogs, createBehaviorLog, getBehaviorLogsByClass, deleteBehaviorLog } = require('../controllers/behaviorLogController');
const protect = require('../middleware/authMiddleware');


const router = express.Router();

// Apply 'protect' to all routes that require authentication
router.use(protect);

// STUDENT LOGS
router.get('/student/:studentId', getAllBehaviorLogs);
router.post('/student/:studentId', createBehaviorLog);

// CLASS LOGS
router.get('/class/:classId', getBehaviorLogsByClass);

// DELETE LOGS
router.delete('/:logId', deleteBehaviorLog);

module.exports = router;