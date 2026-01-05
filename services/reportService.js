// services/reportService.js

const Class = require('../models/Class');
const Student = require('../models/Students');
const BehaviorLog = require('../models/BehaviorLogs');

/**
 * Get a summary report by class
 * @param {String} classId
 * @param {Date} from - optional
 * @param {Date} to - optional
 * @returns {Object} class report data
 */
const getClassReport = async (classId, from, to) => {
    const classData = await Class.findById(classId);
    if (!classData) throw new Error('Class not found');

    const students = await Student.find({ class: classId });
    const studentIds = students.map(s => s._id);
    
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    
    const logFilter = { student: { $in: studentIds } };
    if (from || to) logFilter.occuredAt = dateFilter;
    
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
    const avgPoints = totalLogs ? totalPoints / totalLogs : 0;

    // Map top 5 student
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
 * @param {Date} from - optional
 * @param {Date} to - optional 
 */
const getStudentReport = async (studentId, from, to) => {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const logFilter = { student: studentId };
    if (from || to) logFilter.createdAt = dateFilter;

    const logs = await BehaviorLog.find(logFilter);

    if (!logs.length) return { student_id: studentId, participation_rate: 0, behavior_score: 0 };

    const totalLogs = logs.length;
    const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);

    // Unique days with logs
    const uniqueDays = new Set(
        logs.map(log => log.createdAt.toISOString().slice(0,10))
    ).size;

    // Participation rate = participation logs / unique days with logs
    const participation_rate = Number(
        (totalLogs / uniqueDays).toFixed(2)
    );
        
    // Behavior score = average points per log
    const behavior_score = Number(
        (totalPoints / totalLogs).toFixed(2)
    );

    return {
        student_id: studentId,
        participation_rate,
        behavior_score
    };
};

module.exports = { getClassReport, getStudentReport };