# ClassPulse: Classroom Behavior & Reports Tracker

**Track, log, and analyze student behavior efficiently.**

---

## Table of Contents
1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Features](#features)
5. [Usage](#usage)
6. [Styling Strategy](#styling-strategy)
7. [Roadmap] (#roadmap)
8. [Contributing] (#contributing)
9. [License] (#license)

---

## Project Description

ClassPulse is a full-stack classroom behavior and participation tracking platform designed for teachers and school administrators. It provides real-time insights into student behavior, class engagement, and performance trends through clean dashboards and exportable reports. 

Built with scalability, clarity, and educator usability in mind.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, CSS Modules
- **Backend:** Node.js, Express.js, JWT Authentication 
- **Database:** MongoDB  
- **Other Libraries:** PDFKit, Chart.js, Axios

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/triscravello/classpulse.git
cd classpulse
```

### 2. Backend Setup
``` bash 
npm install
```

Create a .env file with the following variables:
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start backend server:
```bash
npm run server
```

### 3. Frontend Setup
```bash 
cd frontend
npm install
```

Create a .env file with:
REACT_APP_API_URL=http://localhost:5001/api

Start frontend:
```bash
npm start
```

---

## Features

- Teacher login & signup authentication with JWT
- Protected routes for authenticated users
- Dashboard with class statistics 
- Create, edit, and delete classes
- Add and manage students per class
- Classroom view with student list and behavior logs  
- Quick action buttons for fast logging
- Participation rate calculations
- Student & class reports with interactive charts and date-filtered reports
- Export reports as CSV or PDF
- Alerts and toasts for instant feedback
- Responsive UI with Tailwind CSS
- CSS Modules for component-specific styling

---

## Usage

1. Login / Signup – Teachers log in to access their dashboard.
2. Dashboard – Add classe; view classes and overall stats.
3. Classroom View – See students, add behavior logs, and quick actions.
4. Reports – Generate class or individual student reports; export as CSV or PDF.

---

## Styling Strategy

- Tailwind CSS: Layout, spacing, typography, responsive behavior
- CSS Modules: Animation, component-specific states, hover, focus, and transitions

---

## Roadmap

- Toast notifications for actions
- Role-based access (Admin / Teacher)
- Attendance tracking
- Dark mode

---

## Contributing

Pull requests are welcome. 
For major changes, please open an issue first to discuss improvements.

---

## License

This project is licensed under the MIT License.

---

## Author

Tristan Cravello
Built as a full-stack capstone project focused on real-world classroom workflows.