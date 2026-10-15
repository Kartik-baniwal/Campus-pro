# 🏫 SchoolSync — Comprehensive School Management System

A multi-role enterprise web application designed for K–12 and secondary schools, built with **React (Frontend)**, **Node.js + Express (Backend)**, and **PostgreSQL (Database)**.

---

## 🌟 Key Roles & Features

### 1. 🛡️ Administrator
- **Dashboard**: School-wide KPIs (students, faculty, attendance rates, audit statistics).
- **Student Information System (SIS)**: Student directory, enrollment, guardian records, emergency contacts.
- **Faculty & Staff**: Teacher department assignments, employment roles.
- **User Accounts**: RBAC security, account creation, status toggles, password reset.
- **Academic Setup**: Academic years, term calendar, grade levels, sections, curriculum subjects.
- **Oversight**: School-wide coursework monitoring and daily attendance tracking.
- **Audit Ledger**: Immutable logging of all sensitive administrative, financial, and grade adjustments.

### 2. 👨‍🏫 Teacher
- **Teaching Dashboard**: Today's lecture schedule, quick roll-call status, assignments to grade.
- **Interactive Attendance**: Live roll-call (Present, Absent, Late, Excused), section selection, one-click "Mark All Present", remarks.
- **Coursework & Homework**: Publish assignments, set deadlines and point scales, review submissions, give feedback.
- **Gradebook & Assessments**: Formal exam evaluations (Mid-terms, finals, quizzes), bulk grade entry, letter grade calculation, publish results.
- **Classroom Roster & Timetable**: Student contact lists and weekly timetable grid.

### 3. 🎓 Student & Parent Portal
- **Student Dashboard**: Real-time attendance percentage, GPA, class rank, upcoming deadlines, fee status.
- **Attendance Records**: Session-by-session history with excused/unexcused breakdowns.
- **Homework & Submissions**: Submit answers, file upload links, track graded submissions with teacher notes.
- **Official Report Card**: Term-by-term grade breakdown, credit hours, teacher remarks, printable transcript.
- **Weekly Schedule**: Period-by-period class timetable with classroom numbers.
- **Fee Statements**: Outstanding dues, online payment simulation, printable payment receipts.

### 4. 💳 Fee Department & Bursar
- **Finance Dashboard**: Total collections, pending receivables, collection rates, overdue follow-ups.
- **Invoice Ledger**: Generate bulk invoices by grade level, term billing, dispatch payment reminders.
- **Collections & Receipts**: Record walk-in / bank transfer payments with instant receipt numbers.
- **Fee Schedules & Plans**: Structured installment plans with approval workflows.
- **Fee Categories**: Tuition, lab fees, transportation, library, athletic, technology heads.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router 7, React Icons, React Hot Toast, Recharts, Vanilla CSS Design System with dark glassmorphic styling.
- **Backend**: Node.js, Express, PostgreSQL driver (`pg`), JWT authentication, bcryptjs, Helmet, CORS, Express Rate Limit.
- **Database**: PostgreSQL with standard SQL migrations (raw SQL migrations in `Backend/src/migrations/migrate.js`, no Prisma).

---

## 🚀 Quick Start Guide

### 1. Backend Setup
1. Open terminal in `Backend`:
   ```bash
   cd Backend
   npm install
   ```
2. Configure `.env` with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=school_management
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5001
   JWT_SECRET=school_mgmt_super_secret_key_2026_change_in_production
   CORS_ORIGIN=http://localhost:5173
   ```
3. Run the database migration script:
   ```bash
   npm run migrate
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open another terminal in `Frontend`:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Demo Accounts

The login screen provides one-click credentials for instant testing:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@school.com` | `Admin@123` |
| **Teacher** | `teacher@school.com` | `Admin@123` |
| **Student** | `student@school.com` | `Admin@123` |
| **Fee Department** | `fee@school.com` | `Admin@123` |

*Note: The frontend includes graceful demo fallbacks, allowing you to explore all four role dashboards seamlessly even before connecting to a live PostgreSQL instance.*
