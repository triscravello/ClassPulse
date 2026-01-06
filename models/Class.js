const mongoose = require('mongoose');

const classSchema = new mongoose.Schema (
    {
        name: { type: String, required: true },
        teacher: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        subject: { type: String, enum: ["Math", "Science", "English", "History", "Other"], default: "Other" }
    }, 
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Index for performance and safety
classSchema.index({ teacher: 1 });
classSchema.index({ name: 1, teacher: 1}, { unique: true }); // Prevent duplicate class names per teacher

// Virtuals
classSchema.virtual('students', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'class'
});

module.exports = mongoose.model("Class", classSchema);