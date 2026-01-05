// services/studentService.js

const Student = require("../models/Students");
const Class = require("../models/Class");

/**
 * Helper: ensure the user is authorized for the class
 */
async function authorizeClassAccess(classId, userId) {
    const foundClass = await Class.findById(classId);
    if (!foundClass) throw { status: 400, message: "Class not found." };
    if (foundClass.teacher.toString() !== userId) throw { status: 401, message: "Not authorized." };
    return foundClass;
};

/**
 * Get all students in a class
 * @param {String} classId 
 */
const getAllStudents = async (classId) => {
    await authorizeClassAccess(classId, userId);
    return await Student.find({ class: classId });
};

/**
 * Add a new student in a class
 * @param {String} classId
 * @param {Object} studentData
 * @param {String} userId
 */
const createStudent = async (classId, studentData, userId) => {
    await authorizeClassAccess(classId, userId);
    const { first_name, last_name } = studentData;

    if (!first_name) throw { status: 400, message: "Invalid data." };

    const newStudent = await Student.create({ ...studentData, class: classId });
    return newStudent
};

/**
 * Get a single student's profile
 * @param {String} classId
 * @param {String} studentId
 * @param {string} userId
 */
const getStudent = async (classId, studentId, userId) => {
    await authorizeClassAccess(classId, userId);

    const student = await Student.findById(studentId).populate('class');
    if (!student) throw { status: 404, message: "Student not found" };
    return student;
};

/**
 * Update a student's info
 * @param {String} classId
 * @param {String} studentId
 * @param {Object} updatedData
 * @param {String} userId
 */
const updateStudent = async (classId, studentId, updatedData, userId) => {
    await authorizeClassAccess(classId, userId);

    const student = await Student.findById(studentId);
    if (!student) throw { status: 404, message: "Student not found" };

    Object.assign(student, updatedData);
    await student.save();

    return student;
};

/**
 * Delete a student
 * @param {String} classId
 * @param {String} studentId
 * @param {String} userId
 */
const removeStudent = async (classId, studentId, userId) => {
    await authorizeClassAccess(classId, userId);

    const student = await Student.findById(studentId);
    if (!student) throw { status: 404, message: "Student not found" };

    await student.deleteOne();
    return { message: "Student deleted." };
};

module.exports = {
    getAllStudents,
    createStudent,
    getStudent,
    updateStudent,
    removeStudent
};