import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CourseForm from './components/CourseForm';
import CourseDetails from './components/CourseDetails';
import BrowseCourses from './components/BrowseCourses';
import Wallet from './components/common/Wallet';
import RoleSelection from './components/RoleSelection';
import { Web3Provider, useWeb3Context } from './components/hooks/Web3Context';
import SectionQuiz from './components/SectionQuiz';

function StudentDashboardWrapper() {
  const navigate = useNavigate();
  return <StudentDashboard />;
}

function InstructorDashboardWrapper() {
  const navigate = useNavigate();
  return <InstructorDashboard />;
}

function DashboardWrapper() {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  
  if (userRole === "student") {
    navigate("/student/dashboard");
    return null;
  } else if (userRole === "instructor") {
    navigate("/instructor/dashboard");
    return null;
  }
  // Fallback to original dashboard
  return <Dashboard onAddCourse={() => navigate('/add-course')} onCourseClick={course => navigate(`/course/${course.id || 1}`)} />;
}

function CourseFormWrapper() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const backPath = userRole === "instructor" ? "/instructor/dashboard" : "/dashboard";
  return <CourseForm onBack={() => navigate(backPath)} />;
}

function CourseDetailsWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userRole = localStorage.getItem("userRole");
  const backPath = userRole === "student" ? "/student/dashboard" : userRole === "instructor" ? "/instructor/dashboard" : "/dashboard";
  
  // You can fetch course details by id here if needed
  // For now, just pass a dummy course
  const dummyCourse = { title: 'Course', progress: 3, total: 5, tokens: 150 };
  return <CourseDetails course={dummyCourse} onBack={() => navigate(backPath)} />;
}

function RequireWallet({ children }) {
  const { account, isMetaMaskInstalled } = useWeb3Context();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isMetaMaskInstalled || !account) {
      navigate('/wallet');
    }
  }, [account, isMetaMaskInstalled, navigate]);

  if (!isMetaMaskInstalled || !account) {
    return null; // Or a loading spinner
  }
  return children;
}

function RequireRoleSelection({ children }) {
  const { account } = useWeb3Context();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (account) {
      const hasSelectedRole = localStorage.getItem("hasSelectedRole");
      if (!hasSelectedRole) {
        navigate('/role-selection');
      }
    }
  }, [account, navigate]);

  return children;
}

export default function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-blue-50">
          <Routes>
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <StudentDashboardWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/student/courses" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <BrowseCourses />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/student/course/:id" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <CourseDetailsWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            
            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <InstructorDashboardWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/instructor/add-course" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <CourseFormWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/instructor/course/:id" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <CourseDetailsWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            
            {/* Legacy Routes - redirect based on role */}
            <Route path="/" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <DashboardWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/dashboard" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <DashboardWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/add-course" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <CourseFormWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/course/:id" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <CourseDetailsWrapper />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/courses" element={
              <RequireWallet>
                <RequireRoleSelection>
                  <BrowseCourses />
                </RequireRoleSelection>
              </RequireWallet>
            } />
            <Route path="/course/:courseId/section/:sectionId/quiz" element={<SectionQuiz />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}
