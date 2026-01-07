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

const API_VERSION = '/api/v1';

// use routes 
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/classes`, classRoutes);
app.use(`${API_VERSION}/classes/:classId/students`, studentRoutes);
app.use(`${API_VERSION}/behaviorlogs`, behaviorLogRoutes);
app.use(`${API_VERSION}/reports`, reportRoutes);

app.get("/", (req, res) => res.send("Welcome to ClassPulse API"));

module.exports = app;