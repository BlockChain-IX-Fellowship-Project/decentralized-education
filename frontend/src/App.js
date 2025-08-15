import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CourseForm from "./components/CourseForm";
import CourseDetails from "./components/CourseDetails";
import BrowseCourses from "./components/BrowseCourses";
import Profile from "./components/Profile";
import Wallet from "./components/common/Wallet";
import { Web3Provider, useWeb3Context } from "./components/hooks/Web3Context";
import SectionQuiz from "./components/SectionQuiz";
import CertificateVerifier from "./components/CertificateVerifier";
import About from "./components/common/About";

function DashboardWrapper() {
  const navigate = useNavigate();
  return (
    <Dashboard
      onAddCourse={() => navigate("/add-course")}
      onCourseClick={(course) => navigate(`/course/${course.id || 1}`)}
    />
  );
}

function CourseFormWrapper() {
  const navigate = useNavigate();
  return <CourseForm onBack={() => navigate("/dashboard")} />;
}

function CourseDetailsWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();
  // You can fetch course details by id here if needed
  // For now, just pass a dummy course
  const dummyCourse = { title: "Course", progress: 3, total: 5, tokens: 150 };
  return (
    <CourseDetails course={dummyCourse} onBack={() => navigate("/dashboard")} />
  );
}

function RequireWallet({ children }) {
  const { account, isMetaMaskInstalled } = useWeb3Context();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isMetaMaskInstalled || !account) {
      navigate("/wallet");
    }
  }, [account, isMetaMaskInstalled, navigate]);

  if (!isMetaMaskInstalled || !account) {
    return null; // Or a loading spinner
  }
  return children;
}

export default function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-blue-50">
          <Routes>
            <Route path="/wallet" element={<Wallet />} />
            <Route
              path="/"
              element={
                <RequireWallet>
                  <DashboardWrapper />
                </RequireWallet>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={
                <RequireWallet>
                  <DashboardWrapper />
                </RequireWallet>
              }
            />
            <Route
              path="/add-course"
              element={
                <RequireWallet>
                  <CourseFormWrapper />
                </RequireWallet>
              }
            />
            <Route
              path="/course/:id"
              element={
                <RequireWallet>
                  <CourseDetailsWrapper />
                </RequireWallet>
              }
            />
            <Route
              path="/courses"
              element={
                <RequireWallet>
                  <BrowseCourses />
                </RequireWallet>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireWallet>
                  <Profile />
                </RequireWallet>
              }
            />
            <Route
              path="/course/:courseId/section/:sectionId/quiz"
              element={<SectionQuiz />}
            />
            <Route
              path="/verify-certificate"
              element={<CertificateVerifier />}
            />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}
