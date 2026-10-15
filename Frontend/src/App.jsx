import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagement from './pages/admin/StudentsManagement';
import StaffManagement from './pages/admin/StaffManagement';
import UserAccountsPage from './pages/admin/UserAccountsPage';
import AcademicYearsPage from './pages/admin/AcademicYearsPage';
import SectionsPage from './pages/admin/SectionsPage';
import SubjectsPage from './pages/admin/SubjectsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';
import AuditLogPage from './pages/admin/AuditLogPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherAssessments from './pages/teacher/TeacherAssessments';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherTimetable from './pages/teacher/TeacherTimetable';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentFees from './pages/student/StudentFees';

// Fee Department Pages
import FeeDashboard from './pages/fees/FeeDashboard';
import FeeInvoices from './pages/fees/FeeInvoices';
import FeePayments from './pages/fees/FeePayments';
import FeePlans from './pages/fees/FeePlans';
import FeeCategories from './pages/fees/FeeCategories';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0d14', color: '#94a3b8' }}>
        Loading EduPulse...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'fee_department') return <Navigate to="/fees" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
  if (user.role === 'student') return <Navigate to="/student" replace />;
  if (user.role === 'fee_department') return <Navigate to="/fees" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#161d2a',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="users" element={<UserAccountsPage />} />
            <Route path="academic-years" element={<AcademicYearsPage />} />
            <Route path="sections" element={<SectionsPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="assignments" element={<AdminAssignmentsPage />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="assessments" element={<TeacherAssessments />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="timetable" element={<TeacherTimetable />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="fees" element={<StudentFees />} />
          </Route>

          {/* Fee Department Routes */}
          <Route
            path="/fees"
            element={
              <ProtectedRoute allowedRoles={['fee_department']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FeeDashboard />} />
            <Route path="invoices" element={<FeeInvoices />} />
            <Route path="payments" element={<FeePayments />} />
            <Route path="plans" element={<FeePlans />} />
            <Route path="categories" element={<FeeCategories />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
