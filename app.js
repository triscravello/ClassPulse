const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const behaviorLogRoutes = require('./routes/behaviorLogRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// use routes 
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/classes/:classId/students", studentRoutes);
app.use("/api/behaviorlogs", behaviorLogRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.send("Welcome to ClassPulse API"));

module.exports = app;