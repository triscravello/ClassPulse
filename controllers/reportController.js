// controllers/reportController.js

const Class = require('../models/Class');
const Student = require('../models/Students');
const BehaviorLog = require('../models/BehaviorLogs');
const { Parser } = require('json2csv');
const { createPDFBuffer } = require('../utils/pdfExport');

// GET a summary report by class
const getClassReport = async (req, res) => {
    try {
        const { classId } = req.params;
        const { from, to } = req.query;
        
        const classData = await Class.findById(classId)
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

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
        const avgPoint = logs.length 
            ? (logs.reduce((sum, log) => sum + log.totalPoints, 0) / logs.length) 
            : 0;
        
        // Sort top students and populate first_name, last_name
        const topStudents = await Promise.all(
            logs
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 5)
            .map(async log => {
                const student = await Student.findById(log._id).select('first_name last_name');
                return {
                    student_id: log._id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    total_points: log.totalPoints
                };
            })
        );
        
        return res.json({
            class_id: classId,
            total_logs: totalLogs,
            avg_points: avgPoint,
            top_students: topStudents
        });

    } catch (error) {
        console.error("Error generating class report:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET an individual student's report
const getStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { from, to } = req.query;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Students not found' });
        }

        // Build date filter
        const dateFilter = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to);  
        
        const logFilter = { student: studentId };
        if (from || to) logFilter.createdAt = dateFilter;

        const logs = await BehaviorLog.find(logFilter);

        if (!logs.length) {
            return res.json({
                student_id: studentId,
                participation_rate: 0,
                behavior_score: 0
            });
        }

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
        ) ;
        
        return res.json({
            student_id: studentId,
            participation_rate,
            behavior_score
        });

    } catch (error) {
        console.error("Error generating student report:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET export data as CSV or PDF
const exportReport = async (req, res) => {
    try {
        const { classId, type } = req.query;

        // Validate export type
        if (!type || !['csv', 'pdf'].includes(type.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid export type. Use csv or pdf.' });
        };

        let students;

        if (classId) {
            const classData = await Class.findById(classId);
            if (!classData) {
                return res.status(404).json({ message: 'Class not found' });
            }
            students = await Student.find({ class: classId });
        } else {
            // Export all students if no classId provided
            students = await Student.find();
        }

        const studentIds = students.map(s => s._id);

        const logs = await BehaviorLog.find({ student: { $in: studentIds } })
            .populate('student', 'first_name last_name');
        
        const exportData = logs.map(log => ({
            student_id: log.student?._id.toString(),
            student_name: log.student 
                ? `${log.student.first_name} ${log.student.last_name}`
                : 'Unknown Student',
            type: log.type,
            comment: log.comment,
            points: log.value,
            created_at: log.createdAt
        }));

        if (type === 'csv') {
            const fields = ['student_name', 'type', 'comment', 'points', 'created_at'];
            const parser = new Parser({ fields });
            const csv = parser.parse(exportData);
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename="class_${classId}_report.csv"`);
            return res.send(csv);
        };

        if (type === 'pdf') {
            const pdfBuffer = await createPDFBuffer(exportData);
            res.header('Content-Type', 'application/pdf');
            res.header('Content-Disposition', `attachment; filename="class_${classId}_report.pdf"`);
            return res.send(pdfBuffer);
        }

        return res.status(400).json({ message: 'Invalid export type. Use csv or pdf.' });
    } catch (error) {
        console.error("Error exporting report:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getClassReport, getStudentReport, exportReport };
