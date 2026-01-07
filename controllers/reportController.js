// controllers/reportController.js

const Class = require('../models/Class');
const Student = require('../models/Students');
const BehaviorLog = require('../models/BehaviorLogs');
const { Parser } = require('json2csv');
const { createPDFBuffer } = require('../utils/pdfExport');
const reportService = require('../services/reportService');

// GET a summary report by class
const getClassReport = async (req, res) => {
    try {
        const { classId } = req.params;
        const { from, to } = req.query;
        
        const report = await reportService.getClassReport(classId, from, to);
        return res.json(report);
    } catch (error) {
        console.error("Error generating class report:", error);

        if (error.message === 'Class not found') {
            return res.status(404).json({ message: error.message })
        }

        res.status(500).json({ message: 'Server error' });
    }
};

// GET an individual student's report
const getStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { from, to } = req.query;

        const report = await reportService.getStudentReport(studentId, from, to);
        return res.json(report);
    } catch (error) {
        console.error("Error generating student report:", error);

        if (error.message === 'Student not found') {
            return res.status(404).json({ message: error.message })
        }
        
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
            occurred_at: log.occurredAt
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
