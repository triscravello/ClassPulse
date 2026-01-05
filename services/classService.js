// /services/classService.js

const Class = require('../models/Class');

/**
 * Get all classes for a specific teacher
 * @param {String} teacherId
 */
const getAllClasses = async (teacherId) => {
  return await Class.find({ teacher: teacherId });
};

/**
 * Create a new class
 * @param {Object} data - { name, subject }
 * @param {String} teacherId
 */
const createClass = async (data, teacherId) => {
  const { name, subject } = data;
  if (!name) throw new Error('Name is required.');

  const newClass = await Class.create({
    name,
    subject,
    teacher: teacherId,
  });

  return newClass;
};

/**
 * Get a class by ID with ownership check
 * @param {String} classId
 * @param {String} teacherId
 */
const getClassById = async (classId, teacherId) => {
  const foundClass = await Class.findById(classId);
  if (!foundClass) throw new Error('Class not found.');
  if (foundClass.teacher.toString() !== teacherId) throw new Error('Not authorized.');

  return foundClass;
};

/**
 * Update a class by ID with ownership check
 * @param {String} classId
 * @param {Object} data - { name, subject }
 * @param {String} teacherId
 */
const updateClass = async (classId, data, teacherId) => {
  const foundClass = await Class.findById(classId);
  if (!foundClass) throw new Error('Class not found.');
  if (foundClass.teacher.toString() !== teacherId) throw new Error('Not authorized.');

  if (!data.name) throw new Error('Name is required.');

  foundClass.name = data.name;
  foundClass.subject = data.subject ?? foundClass.subject;

  return await foundClass.save();
};

/**
 * Delete a class by ID with ownership check
 * @param {String} classId
 * @param {String} teacherId
 */
const deleteClass = async (classId, teacherId) => {
  const foundClass = await Class.findById(classId);
  if (!foundClass) throw new Error('Class not found.');
  if (foundClass.teacher.toString() !== teacherId) throw new Error('Not authorized.');

  await foundClass.deleteOne();
  return { message: 'Class deleted.' };
};

module.exports = {
  getAllClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
};
