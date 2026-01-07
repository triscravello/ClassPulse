const Class = require('../models/Class');
const Student = require('../models/Students');
const BehaviorLog = require('../models/BehaviorLogs');

/**
 * Helper to build a date filter with optional from/to
 */
const buildDateFilter = (from, to) => {
    const filter = {};
    if (from) filter.$gte = new Date(from);
    if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.$lte = toDate;
    }
    return Object.keys(filter).length ? filter : null;
};

/**
 * Get a summary report by class
 * @param {String} classId
 * @param {Date|string} from - optional
 * @param {Date|string} to - optional
 * @returns {Object} class report data
 */
const getClassReport = async (classId, from, to) => {
    const classData = await Class.findById(classId);
    if (!classData) throw new Error('Class not found');

    const students = await Student.find({ class: classId });
    const studentIds = students.map(s => s._id);

    const dateFilter = buildDateFilter(from, to);

    const logFilter = { 
        class: classId,
        student: { $in: studentIds }
    };
    if (dateFilter) logFilter.occurredAt = dateFilter;

    const logs = await BehaviorLog.aggregate([
        { $match: logFilter },
        { 
            $group: {
                _id: "$student",
                totalPoints: { $sum: "$value" },
                totalLogs: { $sum: 1 }
            }
        }
    ]);

    const totalLogs = logs.reduce((sum, log) => sum + log.totalLogs, 0);
    const totalPoints = logs.reduce((sum, log) => sum + log.totalPoints, 0);
    const avgPoints = students.length ? totalPoints / students.length : 0;

    const topStudents = logs
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5)
        .map(log => {
            const student = students.find(s => s._id.toString() === log._id.toString());
            return {
                student_id: log._id,
                first_name: student?.first_name || 'Unknown',
                last_name: student?.last_name || 'Student',
                total_points: log.totalPoints
            };
        });

    return {
        class_id: classId,
        total_logs: totalLogs,
        avg_points: Number(avgPoints.toFixed(2)),
        top_students: topStudents
    };
};

/**
 * Get an individual student's report
 * @param {String} studentId
 * @param {Date|string} from - optional
 * @param {Date|string} to - optional 
 */
const getStudentReport = async (studentId, from, to) => {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const dateFilter = buildDateFilter(from, to);

    const logFilter = { student: studentId };
    if (dateFilter) logFilter.occurredAt = dateFilter;

    const logs = await BehaviorLog.find(logFilter);

    if (!logs.length) return { student_id: studentId, participation_rate: 0, behavior_score: 0 };

    const totalLogs = logs.length;
    const totalPoints = logs.reduce((sum, log) => sum + log.value, 0);

    const uniqueDays = new Set(
        logs.map(log => log.occurredAt.toISOString().slice(0,10))
    ).size;

    return {
        student_id: studentId,
        participation_rate: Number((totalLogs / uniqueDays).toFixed(2)),
        behavior_score: Number((totalPoints / totalLogs).toFixed(2))
    };
};

module.exports = { getClassReport, getStudentReport };