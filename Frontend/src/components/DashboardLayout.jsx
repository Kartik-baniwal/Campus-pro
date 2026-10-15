import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineAcademicCap, HiOutlineHome, HiOutlineUsers, HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays, HiOutlineBanknotes, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle,
  HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineBell, HiOutlineChartBar,
  HiOutlineClock, HiOutlineUserGroup, HiOutlineClipboardDocumentCheck, HiOutlineBuildingLibrary,
  HiOutlineCalculator, HiOutlineCreditCard, HiOutlineReceiptPercent, HiOutlineShieldCheck,
  HiOutlineDocumentChartBar, HiOutlineTableCells,
} from 'react-icons/hi2';

const navConfig = {
  admin: {
    title: 'Administration',
    sections: [
      {
        title: 'Overview',
        links: [
          { to: '/admin', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
        ],
      },
      {
        title: 'People',
        links: [
          { to: '/admin/students', icon: <HiOutlineUsers />, label: 'Students' },
          { to: '/admin/staff', icon: <HiOutlineUserGroup />, label: 'Staff' },
          { to: '/admin/users', icon: <HiOutlineShieldCheck />, label: 'User Accounts' },
        ],
      },
      {
        title: 'Academics',
        links: [
          { to: '/admin/academic-years', icon: <HiOutlineCalendarDays />, label: 'Academic Years' },
          { to: '/admin/sections', icon: <HiOutlineTableCells />, label: 'Sections' },
          { to: '/admin/subjects', icon: <HiOutlineBookOpen />, label: 'Subjects' },
          { to: '/admin/assignments', icon: <HiOutlineBuildingLibrary />, label: 'Assignments' },
        ],
      },
      {
        title: 'Operations',
        links: [
          { to: '/admin/attendance', icon: <HiOutlineClipboardDocumentCheck />, label: 'Attendance' },
          { to: '/admin/audit-log', icon: <HiOutlineDocumentChartBar />, label: 'Audit Log' },
        ],
      },
    ],
  },
  teacher: {
    title: 'Teaching',
    sections: [
      {
        title: 'Overview',
        links: [
          { to: '/teacher', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
        ],
      },
      {
        title: 'Classroom',
        links: [
          { to: '/teacher/attendance', icon: <HiOutlineClipboardDocumentCheck />, label: 'Attendance' },
          { to: '/teacher/assignments', icon: <HiOutlineClipboardDocumentList />, label: 'Assignments' },
          { to: '/teacher/assessments', icon: <HiOutlineDocumentText />, label: 'Assessments' },
        ],
      },
      {
        title: 'Class',
        links: [
          { to: '/teacher/students', icon: <HiOutlineUsers />, label: 'My Students' },
          { to: '/teacher/timetable', icon: <HiOutlineClock />, label: 'Timetable' },
        ],
      },
    ],
  },
  student: {
    title: 'Student Portal',
    sections: [
      {
        title: 'Overview',
        links: [
          { to: '/student', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
        ],
      },
      {
        title: 'Learning',
        links: [
          { to: '/student/timetable', icon: <HiOutlineClock />, label: 'Timetable' },
          { to: '/student/attendance', icon: <HiOutlineCalendarDays />, label: 'Attendance' },
          { to: '/student/assignments', icon: <HiOutlineClipboardDocumentList />, label: 'Assignments' },
          { to: '/student/results', icon: <HiOutlineChartBar />, label: 'Results' },
        ],
      },
      {
        title: 'Finance',
        links: [
          { to: '/student/fees', icon: <HiOutlineBanknotes />, label: 'Fee Status' },
        ],
      },
    ],
  },
  fee_department: {
    title: 'Fee Management',
    sections: [
      {
        title: 'Overview',
        links: [
          { to: '/fees', icon: <HiOutlineHome />, label: 'Dashboard', end: true },
        ],
      },
      {
        title: 'Billing',
        links: [
          { to: '/fees/invoices', icon: <HiOutlineReceiptPercent />, label: 'Invoices' },
          { to: '/fees/payments', icon: <HiOutlineCreditCard />, label: 'Payments' },
          { to: '/fees/plans', icon: <HiOutlineCalculator />, label: 'Fee Plans' },
          { to: '/fees/categories', icon: <HiOutlineBanknotes />, label: 'Categories' },
        ],
      },
    ],
  },
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const config = navConfig[user.role] || navConfig.student;
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const roleName = user.role === 'fee_department' ? 'Fee Department' : user.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <HiOutlineAcademicCap />
          </div>
          <div>
            <h1>SchoolSync</h1>
            <span>{config.title}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {config.sections.map((section, i) => (
            <div key={i}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.firstName} {user.lastName}</div>
            <div className="sidebar-user-role">{roleName}</div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
            <HiOutlineArrowRightOnRectangle />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
