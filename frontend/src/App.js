import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CourseForm from './components/CourseForm';
import CourseDetails from './components/CourseDetails';

function DashboardWrapper() {
  const navigate = useNavigate();
  return <Dashboard onAddCourse={() => navigate('/add-course')} onCourseClick={course => navigate(`/course/${course.id || 1}`)} />;
}

function CourseFormWrapper() {
  const navigate = useNavigate();
  return <CourseForm onBack={() => navigate('/dashboard')} />;
}

function CourseDetailsWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();
  // You can fetch course details by id here if needed
  // For now, just pass a dummy course
  const dummyCourse = { title: 'Course', progress: 3, total: 5, tokens: 150 };
  return <CourseDetails course={dummyCourse} onBack={() => navigate('/dashboard')} />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/add-course" element={<CourseFormWrapper />} />
          <Route path="/course/:id" element={<CourseDetailsWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}
