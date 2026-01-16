// controllers/studentController.js
const studentService = require('../services/studentService');

/**
 * Async wrapper to handle errors
 */
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET all students in a class
 */
const getAllStudents = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const students = await studentService.getAllStudents(classId, req.user.id);
    res.status(200).json({ students });
});

/**
 * POST add a new student to a class
 */
const createStudent = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const newStudent = await studentService.createStudent(classId, req.body, req.user.id);
    res.status(201).json({ student: newStudent });
});

/**
 * GET a single student's profile
 */
const getStudent = asyncHandler(async (req, res) => {
    const { classId, studentId } = req.params;
    const student = await studentService.getStudent(classId, studentId, req.user.id);
    res.status(200).json(student);
});

/**
 * PUT update a student's info
 */
const updateStudent = asyncHandler(async (req, res) => {
    const { classId, studentId } = req.params;
    const updatedStudent = await studentService.updateStudent(classId, studentId, req.body, req.user.id);
    res.status(200).json(updatedStudent);
});

/**
 * DELETE a student
 */
const removeStudent = asyncHandler(async (req, res) => {
    const { classId, studentId } = req.params;
    const result = await studentService.removeStudent(classId, studentId, req.user.id);
    res.status(200).json(result);
});

module.exports = {
    getAllStudents,
    createStudent,
    getStudent,
    updateStudent,
    removeStudent
};