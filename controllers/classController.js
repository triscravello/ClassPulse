const Class = require('../models/Class');

// GET all classes for logged-in teacher
const getClasses = async(req, res) => {
    try {
        const classes = await Class.find( {teacher: req.user.id} );
        res.status(200).json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE a class
const createClass = async (req, res) => {
    try {
        const { name, subject } = req.body;
        if(!name) return res.status(400).json({ error: 'name required'});

        const newClass = await Class.create({name, subject, teacher: req.user.id});

        res.status(201).json({ newClass });
    } catch (err) {
        res.status(500).json({ error: 'Error creating a class.'})
    }
};

// GET details of a specific class
const getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find a class
        const foundClass = await Class.findById(id);

        if (!foundClass) {
            return res.status(404).json({ error: 'Class not found.'})
        }

        // Authorization: ensure user owns this class
        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized." });
        }

        res.status(200).json(foundClass);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

// PUT update class details
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subject } = req.body;
        
        // Validate required fields for PUT
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }

        const foundClass = await Class.findById(id);
        if (!foundClass) return res.status(404).json({ error: 'Class not found.' });

        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized to update class.' })
        }

        // Apply updates
        foundClass.name = name;
        foundClass.subject = subject ?? foundClass.subject;

        const saved = await foundClass.save();
        
        res.status(200).json(saved);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE delete a class
const removeClass = async (req, res) => {
    try {
        const { id } = req.params;
        const foundClass = await Class.findById(id);
        if (!foundClass) return res.status(404).json({ error: 'Class not found.' });

        if (foundClass.teacher.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized to delete a class.' });
        }
        
        await foundClass.deleteOne();

        res.status(200).json({ message: "Class deleted." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getClasses, createClass, getClassById, updateClass, removeClass };