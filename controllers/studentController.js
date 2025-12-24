const Student = require("../models/Students");
const Class = require("../models/Class");

// GET all students in a class
const getAllStudents = async (req, res) => {
    try {
        const { classId } = req.params;

        // Authorization: ensure user owns this class
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(400).json({ error: "Class not found." });
        }

        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        }

        const students = await Student.find({ class: classId });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST add a new student to a class
const createStudent = async (req, res) => {
    try {
        const { classId } = req.params;
        const { first_name, last_name } = req.body;

        if (!first_name) {
            return res.status(400).json({ error: "Invalid data." });
        }

        // Authorization: ensure user owns this class
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(400).json({ error: "Class not found." });
        }

        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        }

        const newStudent = await Student.create({ first_name, last_name, class: classId });

        res.status(201).json({ student: newStudent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET a student's profile
const getStudent = async (req, res) => {
    try {
        const { studentId, classId } = req.params;

        const student = await Student.findById(studentId).populate('class');
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        };

        // Authorization: ensure user owns this class
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(400).json({ error: "Class not found." });
        };
        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        };

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT update the student's info
const updateStudent = async (req, res) => {
    try {
        const { studentId, classId } = req.params;
        const { first_name, last_name } = req.body;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: "Invalid data." });
        }

        // Authorization: ensure user owns this class
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(400).json({ error: "Class not found." });
        }
        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        }

        if (first_name) student.first_name = first_name;
        if (last_name) student.last_name = last_name;
        await student.save();

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE a student
const removeStudent = async (req, res) => {
    try {
        const { studentId, classId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        };

        // Authorization: ensure user owns this class
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(400).json({ error: "Class not found." });
        };
        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        };

        await student.deleteOne();

        res.status(200).json({ message: "Student deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllStudents, createStudent, getStudent, updateStudent, removeStudent };