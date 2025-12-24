const mongoose = require('mongoose');

const classSchema = new mongoose.Schema (
    {
        name: { type: String, required: true },
        teacher: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        subject: { type: String }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);