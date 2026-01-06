const { required } = require('joi');
const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },

        // "Participation", "On Task", "Disruption", "Tardy"
        category: { type: String, enum: ["Participation", "On Task", "Disruption", "Tardy"], required: true },

        // +1, -1, scoring 
        value: { type: Number, min: -10, max: 10, required: true, },

        // Optional notes for details of event
        comment: { type: String, trim: true, maxlength: 500, },

        // Time stamp of event
        occurredAt: { type: Date, default: Date.now}
    },
    { timestamps: true }
);

// Indexed for reporting performance
behaviorLogSchema.index({ student: 1, occurredAt: -1 });
behaviorLogSchema.index({ class: 1, occurredAt: -1 });

module.exports = mongoose.model("BehaviorLog", behaviorLogSchema);