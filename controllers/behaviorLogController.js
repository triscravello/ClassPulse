// controllers/behaviorLogController.js
const { default: mongoose } = require("mongoose");
const behaviorLogService = require("../services/behaviorLogService");

/**
 * GET all behavior logs for a student
 */
const getAllBehaviorLogs = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const logs = await behaviorLogService.getAllBehaviorLogs(studentId);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching behavior logs for student:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

/**
 * POST a new behavior log
 */
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
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Extract and normalize data
    let { category, comment = "", value } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Normalize category to match schema enum
    category = category.trim().toLowerCase();
    if (category === "positive" || category === "participation") category = "Positive";
    else if (category === "negative") category = "Negative";
    else category = category
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // e.g., "On Task"

    // Validate value
    if (value === undefined || isNaN(Number(value))) {
      return res.status(400).json({ message: "Value must be a number" });
    }
    value = Number(value);

    const logData = { category, comment, value, teacherId };

    const newLog = await behaviorLogService.createBehaviorLog(studentId, logData);
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating behavior log:", error);

    const clientErrors = [
      "Student not found",
      "Student is not assigned to a class",
      "Invalid category",
      "Invalid teacher ID",
    ];
    if (clientErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", details: error.message });
  }
};

/**
 * GET all behavior logs for a class
 */
const getBehaviorLogsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { from, to } = req.query;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const logs = await behaviorLogService.getBehaviorLogsByClass(classId, { from, to });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching behavior logs for class:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

/**
 * DELETE a behavior log
 */
const deleteBehaviorLog = async (req, res) => {
  try {
    const { logId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(logId)) {
      return res.status(400).json({ message: "Invalid log ID" });
    }

    const user = { id: req.user.id, role: req.user.role };
    await behaviorLogService.deleteBehaviorLog(logId, user);

    res.status(200).json({ message: "Log deleted successfully." });
  } catch (error) {
    console.error("Error deleting behavior log:", error);

    const clientErrors = ["Behavior log not found", "Not authorized to delete this log"];
    if (clientErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", details: error.message });
  }
};

module.exports = {
  getAllBehaviorLogs,
  createBehaviorLog,
  getBehaviorLogsByClass,
  deleteBehaviorLog,
};