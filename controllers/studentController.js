const studentService = require('../services/studentService');

/**
 * Async wrapper to forward errors to error middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /classes/:classId/students
 * Get all students in a class
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  const students = await studentService.getAllStudents(
    classId,
    req.user.id
  );

  // Return raw array for easy frontend consumption
  res.status(200).json(students);
});

/**
 * POST /classes/:classId/students
 * Add a new student to a class
 */
const createStudent = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  const newStudent = await studentService.createStudent(
    classId,
    req.body,
    req.user.id
  );

  res.status(201).json({ student: newStudent });
});

/**
 * GET /classes/:classId/students/:studentId
 * Get a single student profile
 */
const getStudent = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params;

  const student = await studentService.getStudent(
    classId,
    studentId,
    req.user.id
  );

  res.status(200).json(student);
});

/**
 * PUT /classes/:classId/students/:studentId
 * Update a student's info
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params;

  const updatedStudent = await studentService.updateStudent(
    classId,
    studentId,
    req.body,
    req.user.id
  );

  res.status(200).json(updatedStudent);
});

/**
 * DELETE /classes/:classId/students/:studentId
 * Remove a student from a class
 */
const removeStudent = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params;

  await studentService.removeStudent(
    classId,
    studentId,
    req.user.id
  );

  res.status(200).json({ message: 'Student deleted.' });
});

module.exports = {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  removeStudent,
};