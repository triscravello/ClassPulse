const BehaviorLog = require('../models/BehaviorLogs');
const Student = require('../models/Students');

// GET all behavior logs for a student
const getAllBehaviorLogs = async (req, res) => {
    try {
        const { studentId } = req.params;

        const logs = await BehaviorLog.find({ student: studentId })
            .populate('student', 'first_name last_name')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST a new behavior log
const createBehaviorLog = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { type, comment, value } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const log = await BehaviorLog.create({
            student: studentId,
            teacher: req.user.id,
            class: student.class,
            type,
            comment,
            value
        });

        const populatedLog = await BehaviorLog.findById(log._id)
            .populate('student', 'first_name last_name')
            .populate('teacher', 'name');

        res.status(201).json(populatedLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all behavior logs for a class
const getBehaviorLogsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { from, to } = req.query;

        const filter = { class: classId };

        if (from || to) {
            filter.createdAt = {
                ...(from && { $gte: new Date(from) }),
                ...(to && { $lte: new Date(to) })
            };
        }

        const logs = await BehaviorLog.find(filter)
            .populate('student', 'first_name last_name')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a behavior log
const deleteBehaviorLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await BehaviorLog.findById(logId);
        if (!log) {
            return res.status(404).json({ message: "Log not found." });
        }

        if (log.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized." });
        }

        await log.deleteOne();
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