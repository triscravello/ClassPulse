const { number } = require("joi");
const BehaviorLog = require("../models/BehaviorLogs");
const Student = require("../models/Students");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Get all behavior logs for a student
 */
const getAllBehaviorLogs = async (studentId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error("Invalid student ID");
    }

    try {
        const logs = await BehaviorLog.find({ student: studentId })
            .populate("student", "first_name last_name class")
            .populate("teacher", "name")
            .sort({ occurredAt: -1 }); // sort newest first

        return logs; // empty array if none found
    } catch (err) {
        console.error("Error fetching behavior logs for student:", err);
        throw new Error("Failed to fetch behavior logs");
    }
};

/**
 * Get all behavior logs for a class
 * options: { from: Date, to: Date }
 */
const getBehaviorLogsByClass = async (classId, options = {}) => {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error("Invalid class ID");
    }

    const filter = { class: classId };

    const dateFilter = {};
    if (options.from) dateFilter.$gte = new Date(options.from);
    if (options.to) {
        const toDate = new Date(options.to);
        toDate.setHours(23, 59, 59, 999);
        dateFilter.$lte = toDate;
    }
    if (Object.keys(dateFilter).length) filter.occurredAt = dateFilter;

    try {
        const logs = await BehaviorLog.find(filter)
            .populate("student", "first_name last_name class")
            .populate("teacher", "name")
            .sort({ occurredAt: -1 });

        return logs; // empty array if none
    } catch (err) {
        console.error("Error fetching behavior logs for class:", err);
        throw new Error("Failed to fetch behavior logs for class");
    }
};

/**
 * Create a new behavior log
 * logData: { category, comment, value, teacherId }
 */
const createBehaviorLog = async (studentId, logData) => {
    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error("Invalid student ID");
    }

    const student = await Student.findById(studentId);
    if (!student) throw new Error("Student not found");
    if (!student.class) throw new Error("Student is not assigned to a class");

    let { category, comment = "", value = 0, teacherId } = logData;

    // Normalize category: capitalize first letter
    category = category.trim();
    category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    const allowedCategories = ["Positive", "Negative", "Participation", "On Task", "Disruption", "Tardy"];
    if (!allowedCategories.includes(category)) {
        throw new Error("Invalid category");
    }

    // Ensure value is numeric and within bounds
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < -10 || numericValue > 10) {
        throw new Error("Value must be a number between -10 and 10");
    }

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error("Invalid teacher ID");
    }

    try {
        console.log("Creating behavior log:", {
            student: studentId,
            teacher: teacherId,
            class: student.class,
            category,
            comment,
            value: numericValue,
        });

        const log = await BehaviorLog.create({
            student: studentId,
            teacher: teacherId,
            class: student.class,
            category,
            comment,
            value: numericValue,
        });

        return await BehaviorLog.findById(log._id)
            .populate("student", "first_name last_name class")
            .populate("teacher", "name");
    } catch (err) {
        console.error("Error creating behavior log:", err);
        throw new Error("Failed to create behavior log: " + err.message);
    }
};

/**
 * Delete a behavior log
 * user: { id: string, role: string }
 */
const deleteBehaviorLog = async (logId, user) => {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new Error("Invalid log ID");
    }

    try {
        const log = await BehaviorLog.findById(logId);
        if (!log) throw new Error("Behavior log not found");

        if (log.teacher.toString() !== user.id && user.role !== "admin") {
            throw new Error("Not authorized to delete this log");
        }

        await log.deleteOne();
        return true;
    } catch (err) {
        console.error("Error deleting behavior log:", err);
        throw new Error(err.message || "Failed to delete behavior log");
    }
};

module.exports = {
    getAllBehaviorLogs,
    getBehaviorLogsByClass,
    createBehaviorLog,
    deleteBehaviorLog,
};
