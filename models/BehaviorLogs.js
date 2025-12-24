const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true
        },

        // "Participation", "On Task", "Disruption", "Tardy"
        type: { type: String, required: true },

        // +1, -1, scoring 
        value: { type: Number, default: 0 },

        // Optional notes for details of event
        comment: { type: String },

        // Time stamp of event
        occuredAt: { type: Date, default: Date.now}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Behavior Log", behaviorLogSchema);