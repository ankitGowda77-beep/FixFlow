# FixFlow – Smart Maintenance & Complaint Management System

FixFlow is a full-stack web application designed to simplify maintenance complaint management for apartments, colleges, hostels, offices, and other organizations.

It allows users to report maintenance issues while administrators can track complaints, assign technicians, update complaint statuses, and monitor maintenance activities through an interactive dashboard.

## Features

- **Dashboard:** Overview of total, pending, in-progress, resolved, and overdue complaints.
- **Complaint Management:** Create, view, search, filter, update, and delete complaints.
- **Complaint Tracking:** Track complaint status, priority, assigned technician, and resolution details.
- **Technician Management:** View technicians and their current assigned workload.
- **Analytics:** Visualize complaint categories, status distribution, monthly trends, and technician performance.
- **Settings:** Manage administrator and organization preferences.
- **Database Integration:** Store complaint records in MySQL.
- **Input Validation:** Validate incoming API requests.
- **Backend Security:** Helmet security headers and API rate limiting.
- **Error Handling:** Centralized error handling and appropriate API responses.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- React Router
- CSS
- Lucide React
- Recharts

**Backend**
- Node.js
- Express.js
- REST APIs
- MySQL2
- Helmet
- Express Rate Limit

**Database**
- MySQL

**Development Tools**
- Visual Studio Code
- MySQL Workbench
- Git and GitHub

## Project Structure

```text
fixflow/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── complaintController.js
│   ├── middleware/
│   │   └── validateComplaint.js
│   ├── routes/
│   │   └── complaintRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── index.css
│
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd fixflow
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up the MySQL database

Create a database named `fixflow` in MySQL.

```sql
CREATE DATABASE fixflow;
USE fixflow;
```

Create the complaints table:

```sql
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    location VARCHAR(150) NOT NULL,
    assigned_technician VARCHAR(100) DEFAULT 'Unassigned',
    reported_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_date DATETIME NULL,
    resolution_notes TEXT
);
```

### 4. Configure the backend

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder using `.env.example` as a reference.

Configure your own MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fixflow
DB_PORT=3306
PORT=5000
```

Never upload your actual `.env` file or database password to GitHub.

### 5. Start the backend

From the backend folder:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 6. Start the frontend

Open a separate terminal in the project root:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## REST API Endpoints

Base URL: `http://localhost:5000/api/complaints`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all complaints |
| GET | `/:id` | Retrieve a complaint by ID |
| POST | `/` | Create a new complaint |
| PUT | `/:id` | Update a complaint |
| DELETE | `/:id` | Delete a complaint |

## Security and Validation

- Helmet for HTTP security headers.
- Express Rate Limit to limit excessive API requests.
- Middleware for complaint input validation.
- Centralized error handling.
- Environment variables for database credentials.
- `.gitignore` protection for sensitive configuration files.

## Future Enhancements

- Administrator authentication and authorization.
- Role-based access for users and technicians.
- Real-time complaint status notifications.
- Image attachments for maintenance complaints.
- Production deployment.

## Author

Developed as a full-stack development project to demonstrate practical skills in React, Node.js, Express.js, REST API development, and MySQL database integration.
