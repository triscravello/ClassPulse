const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, trim: true },
        last_name: { type: String, trim: true },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        }, 
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Add a teacher reference for authorization clarity
            required: true 
        },
        isActive: {
            type: Boolean,
            default: true
        } // Soft delete support to avoid permanent deletion of student records
    }, 
    { timestamps: true }
);

// Index by class
studentSchema.index({ class: 1 });

// Virtual first name to be useful in UI
studentSchema.virtual('fullName').get(function () {
    return `${this.first_name} ${this.last_name || ''}`.trim();
});

// Enable virtuals
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);