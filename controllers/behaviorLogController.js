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
        const teacherId = req.user.id;
        const logData = { ...req.body, teacherId };

        const newLog = await behaviorLogService.createBehaviorLog(studentId, logData);
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
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