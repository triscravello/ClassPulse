const { default: mongoose } = require('mongoose');
const BehaviorLog = require('../models/BehaviorLogs');
const Student = require('../models/Students');
const behaviorLogService = require('../services/behaviorLogService');

// GET all behavior logs for a student
const getAllBehaviorLogs = async (req, res) => {
    try {
        const { studentId } = req.params;
        const logs = await behaviorLogService.getAllBehaviorLogs(studentId);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST a new behavior log
const createBehaviorLog = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Auth check
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const teacherId = req.user.id;

        // Validate studentId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid student data" });
        }
        
        // Validate request body
        const { category, comment, value } = req.body;
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const logData = { category, comment, value, teacherId };

        const newLog = await behaviorLogService.createBehaviorLog(studentId, logData);
        
        res.status(201).json(newLog);
    } catch (error) {
        // Handle known errors
        if (["Student not found", "Category is required"].includes(error.message)) {
            return res.status(400).json({ message: error.message })
        }
        
        console.error("Error creating behavior log:", error)
        res.status(500).json({ message: "Server error", message: error.message });
    }
};

// GET all behavior logs for a class
const getBehaviorLogsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { from, to } = req.query;

        const logs = await behaviorLogService.getBehaviorLogsByClass(classId, { from, to });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a behavior log
const deleteBehaviorLog = async (req, res) => {
    try {
        const { logId } = req.params;
        const user = { id: req.user.id, role: req.user.role };

        await behaviorLogService.deleteBehaviorLog(logId, user);
        res.status(200).json({ message: "Log deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBehaviorLogs,
    createBehaviorLog,
    getBehaviorLogsByClass,
    deleteBehaviorLog
};