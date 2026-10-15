import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  register: (data) => api.post('/auth/register', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Students
export const studentsAPI = {
  list: (params) => api.get('/students', { params }),
  get: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
};

// Attendance
export const attendanceAPI = {
  getSessions: (params) => api.get('/attendance/sessions', { params }),
  createSession: (data) => api.post('/attendance/sessions', data),
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
  getSectionAttendance: (sectionId, params) => api.get(`/attendance/section/${sectionId}`, { params }),
};

// Academics
export const academicsAPI = {
  getAssignments: (params) => api.get('/academics/assignments', { params }),
  createAssignment: (data) => api.post('/academics/assignments', data),
  updateAssignment: (id, data) => api.put(`/academics/assignments/${id}`, data),
  getSubmissions: (assignmentId) => api.get(`/academics/submissions/${assignmentId}`),
  createSubmission: (data) => api.post('/academics/submissions', data),
  gradeSubmission: (id, data) => api.put(`/academics/submissions/${id}/grade`, data),
  getAssessments: (params) => api.get('/academics/assessments', { params }),
  createAssessment: (data) => api.post('/academics/assessments', data),
  bulkGrades: (data) => api.post('/academics/grades/bulk', data),
  publishResults: (id) => api.post(`/academics/assessments/${id}/publish`),
  getStudentGrades: (studentId) => api.get(`/academics/grades/student/${studentId}`),
  getTimetable: (params) => api.get('/academics/timetable', { params }),
};

// Fees
export const feesAPI = {
  getCategories: () => api.get('/fees/categories'),
  createCategory: (data) => api.post('/fees/categories', data),
  getPlans: (params) => api.get('/fees/plans', { params }),
  createPlan: (data) => api.post('/fees/plans', data),
  approvePlan: (id) => api.post(`/fees/plans/${id}/approve`),
  getInvoices: (params) => api.get('/fees/invoices', { params }),
  createInvoice: (data) => api.post('/fees/invoices', data),
  getPayments: (params) => api.get('/fees/payments', { params }),
  recordPayment: (data) => api.post('/fees/payments', data),
  createAdjustment: (data) => api.post('/fees/adjustments', data),
  approveAdjustment: (id) => api.post(`/fees/adjustments/${id}/approve`),
  getDashboard: () => api.get('/fees/dashboard'),
};

// Admin
export const adminAPI = {
  getSchools: () => api.get('/admin/schools'),
  updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data),
  getAcademicYears: () => api.get('/admin/academic-years'),
  createAcademicYear: (data) => api.post('/admin/academic-years', data),
  getGradeLevels: () => api.get('/admin/grade-levels'),
  createGradeLevel: (data) => api.post('/admin/grade-levels', data),
  getSections: (params) => api.get('/admin/sections', { params }),
  createSection: (data) => api.post('/admin/sections', data),
  getSubjects: () => api.get('/admin/subjects'),
  createSubject: (data) => api.post('/admin/subjects', data),
  getStaff: () => api.get('/admin/staff'),
  createStaff: (data) => api.post('/admin/staff', data),
  createEnrolment: (data) => api.post('/admin/enrolments', data),
  getTeacherAssignments: (params) => api.get('/admin/teacher-assignments', { params }),
  createTeacherAssignment: (data) => api.post('/admin/teacher-assignments', data),
  getCourseOfferings: (params) => api.get('/admin/course-offerings', { params }),
  createCourseOffering: (data) => api.post('/admin/course-offerings', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  getDashboard: () => api.get('/admin/dashboard'),
  getNotifications: () => api.get('/admin/notifications'),
  markNotificationRead: (id) => api.put(`/admin/notifications/${id}/read`),
  sendNotification: (data) => api.post('/admin/notifications', data),
  getAuditLog: (params) => api.get('/admin/audit-log', { params }),
};

export default api;
