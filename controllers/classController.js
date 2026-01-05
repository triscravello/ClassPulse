// /controllers/classController.js

const classService = require('../services/classService');

// GET all classes for logged-in teacher
const getClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses(req.user.id);
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a class
const createClass = async (req, res) => {
  try {
    const newClass = await classService.createClass(req.body, req.user.id);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET details of a specific class
const getClassById = async (req, res) => {
  try {
    const foundClass = await classService.getClassById(req.params.id, req.user.id);
    res.status(200).json(foundClass);
  } catch (err) {
    if (err.message === 'Class not found.') return res.status(404).json({ error: err.message });
    if (err.message === 'Not authorized.') return res.status(401).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// PUT update class details
const updateClass = async (req, res) => {
  try {
    const updatedClass = await classService.updateClass(req.params.id, req.body, req.user.id);
    res.status(200).json(updatedClass);
  } catch (err) {
    if (err.message === 'Class not found.') return res.status(404).json({ error: err.message });
    if (err.message === 'Not authorized.') return res.status(401).json({ error: err.message });
    if (err.message === 'Name is required.') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// DELETE a class
const removeClass = async (req, res) => {
  try {
    const result = await classService.deleteClass(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Class not found.') return res.status(404).json({ error: err.message });
    if (err.message === 'Not authorized.') return res.status(401).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClasses,
  createClass,
  getClassById,
  updateClass,
  removeClass,
};