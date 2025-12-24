# Classroom Behavior & Reports Tracker

**Track, log, and analyze student behavior efficiently.**

---

## Table of Contents
1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Environment Variables](#environment-variables)
5. [Available Scripts](#available-scripts)
6. [Features](#features)
7. [Usage / Screenshots](#usage--screenshots)
8. [License](#license)

---

## Project Description

This application allows teachers to manage student behavior logs, calculate participation rates and behavior scores, and generate class/student reports in CSV or PDF format. Designed with usability in mind, it provides quick logging, data visualization, and export capabilities.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Other Libraries:** PDFKit, Chart.js, Axios

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/triscravello/classpulse.git
cd classroom-behavior-tracker
```

### 2. Backend Setup
cd backend
npm install

Create a .env file with the following variables:
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start backend server:
npm run dev

### 3. Frontend Setup
cd ../frontend
npm install

Create a .env file with:
REACT_APP_API_URL=http://localhost:5001/api

Start frontend:
npm start

---

## Features

- Teacher login & signup authentication
- Dashboard with class statistics 
- Classroom view with student list and behavior logs  
- Quick action buttons for fast logging
- Student & class reports with charts
- Export reports as CSV or PDF
- Alerts and toasts for instant feedback
- Responsive UI with Tailwind CSS

---

## Usage

1. Login / Signup – Teachers log in to access their dashboard.
2. Dashboard – View classes and overall stats.
3. Classroom View – See students, add behavior logs, and quick actions.
4. Reports – Generate class or individual student reports; export as CSV or PDF.
