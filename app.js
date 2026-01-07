const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

const authRoutes = require('./routes/v1/authRoutes');
const classRoutes = require('./routes/v1/classRoutes');
const studentRoutes = require('./routes/v1/studentRoutes');
const behaviorLogRoutes = require('./routes/v1/behaviorLogRoutes');
const reportRoutes = require('./routes/v1/reportRoutes');

dotenv.config();
connectDB();

const app = express();

// Security middlewares
app.use(helmet()); // set secure HTTP headers
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
})); // restrict API access to frontend only

// Parse JSON & URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later."
}); // protect authentication endpoints
app.use('/api/v1/auth', authLimiter);

// API versioning
const API_VERSION = '/api/v1';

// use routes 
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/classes`, classRoutes);
app.use(`${API_VERSION}/classes/:classId/students`, studentRoutes);
app.use(`${API_VERSION}/behaviorlogs`, behaviorLogRoutes);
app.use(`${API_VERSION}/reports`, reportRoutes);

// Health check
app.get("/", (req, res) => res.send("Welcome to ClassPulse API"));

module.exports = app;