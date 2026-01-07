const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/v1/authRoutes');
const classRoutes = require('./routes/v1/classRoutes');
const studentRoutes = require('./routes/v1/studentRoutes');
const behaviorLogRoutes = require('./routes/v1/behaviorLogRoutes');
const reportRoutes = require('./routes/v1/reportRoutes');

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