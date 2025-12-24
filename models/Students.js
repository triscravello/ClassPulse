const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        }, 
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);