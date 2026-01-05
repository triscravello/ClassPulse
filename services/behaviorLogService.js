// services/behaviorLogService.js

const BehaviorLog = require("../models/BehaviorLogs");
const Student = require("../models/Students");
const mongoose = require('mongoose');

/**
 * Get all behavior logs for a student
 * @param {String} studentId
 * @returns {Promise<Array>} Array of behavior logs
 */
const getAllBehaviorLogs = async(studentId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student Id')
    }

    const logs = await BehaviorLog.find({ student: studentId })
        .populate('student', 'first_name last_name')
        .populate('teacher', 'name')
        .sort({ createdAt: -1 });

    return logs;
};

/**
 * Create a new behavior logs
 * @param {String} studentId
 * @param {Object} logData { type, comment, value, teacherId }
 * @returns {Promise<Array>} Newly created behavior log
 */
const createBehaviorLog = async (studentId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID')
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found.")
    }

    const { type, comment, value, teacherId } = logData;

    if (!type) {
        throw new Error("Type is required.")
    }

    const log = await BehaviorLog.create({
        student: studentId,
        teacher: teacherId,
        class: student.class,
        type,
        comment,
        value
    });

    const populatedLog = await BehaviorLog.findById(log._id)
        .populate("student", "first_name last_name")
        .populate("teacher", "name");
    
    return populatedLog;
};

/**
 * Get all behavior logs for a class
 * @param {String} classId
 * @param {Object} options { from: Date|string, to: Date|string }
 * @returns {Promise<Array>} Array of behavior logs
 */
const getBehaviorLogsByClass = async (classId, options = {}) => {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error("Invalid class ID");
    }

    const { from, to } = options;
    const filter = { class: classId };

    if (from || to) {
        filter.createdAt = {
            ...(from && { $gte: new Date(from) }),
            ...(to && { $lte: new Date(to) })
        };
    }

    const logs = await BehaviorLog.find(filter)
        .populate("student", "first_name last_name")
        .populate("teacher", "name")
        .sort({ createdAt: -1 });
    
    return logs;
};

/**
 * Delete a behavior log
 * @param {String} logId
 * @param {Object} user { id: String, role: String }
 * @returns {Promise<void>}
 */
const deleteBehaviorLog = async (logId, user) => {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new Error("Invalid log ID");
    }

    const log = await BehaviorLog.findById(logId);
    if (!log) {
        throw new Error("Behavior log not found");
    }

    if (log.teacher.toString() !== user.id && user.role !== "admin") {
        throw new Error("Not authorized to delete this log");
    }

    await log.deleteOne();
};

module.exports = {
    getAllBehaviorLogs,
    createBehaviorLog,
    getBehaviorLogsByClass, 
    deleteBehaviorLog
};
