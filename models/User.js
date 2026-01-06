const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"], // Avoids duplicate accounts
        },
        password: { type: String, required: true, select: false }, // Hide password by default
        role: {
            type: String,
            enum: ["admin", "teacher", "student", "parent"], // Adding role support in the future
            default: "teacher",
        },
    },
    { timestamps: true }
);

// Hash password safely
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password
userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields from output
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);
