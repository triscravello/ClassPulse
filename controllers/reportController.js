// controllers/reportController.js

const Class = require('../models/Class');
const Student = require('../models/Students');
const BehaviorLog = require('../models/BehaviorLogs');
const { Parser } = require('json2csv');
const { createClassBehaviorPDF } = require('../utils/pdfExport');
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
            return res.status(404).json({ message: error.message });
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
            return res.status(404).json({ message: error.message });
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
        }

        // Fetch students
        let students;
        if (classId) {
            const classData = await Class.findById(classId);
            if (!classData) return res.status(404).json({ message: 'Class not found' });
            students = await Student.find({ class: classId });
        } else {
            students = await Student.find();
        }

        const studentIds = students.map(s => s._id);

        // Fetch behavior logs for these students
        const logs = await BehaviorLog.find({ student: { $in: studentIds } })
            .populate('student', 'first_name last_name')
            .sort({ occurredAt: -1 })
            .lean();
        
        // Normalize logs (handle old/typo fields)
        const normalizedLogs = logs.map(log => ({
            ...log,
            category: log.category || log.type || 'N/A',
            occurredAt: log.occurredAt || log.occuredAt || new Date(),
            student_name: log.student ? `${log.student.first_name || ''} ${log.student.last_name || ''}` : 'Unkonwn Student',
            value: typeof log.value === 'number' ? log.value : 0,
            comment: log.comment || 'N/A'
        }));

        if (type.toLowerCase() === 'csv') {
            // Map logs for CSV
            const exportData = logs.map(log => ({
                student_name: log.student
                    ? `${log.student.first_name || ''} ${log.student.last_name || ''}`.trim()
                    : 'Unknown Student',
                type: log.category || 'N/A',
                comment: log.comment || 'N/A',
                points: typeof log.value === 'number' ? log.value : 0,
                occurred_at: log.occurredAt ? new Date(log.occurredAt).toISOString() : 'N/A'
            }));

            const fields = ['student_name', 'type', 'comment', 'points', 'occurred_at'];
            const parser = new Parser({ fields });
            const csv = parser.parse(exportData);

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename="class_${classId || 'all'}_report.csv"`);
            return res.send(csv);
        }

        if (type.toLowerCase() === 'pdf') {
            // PDF now receives normalizedLogs (array)
            const pdfBuffer = await createClassBehaviorPDF(normalizedLogs);
            res.header('Content-Type', 'application/pdf');
            res.header('Content-Disposition', `attachment; filename="class_${classId || 'all'}_report.pdf"`);
            return res.send(pdfBuffer);
        }

        return res.status(400).json({ message: 'Invalid export type. Use csv or pdf.' });
    } catch (error) {
        console.error("Error exporting report:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getClassReport, getStudentReport, exportReport };

