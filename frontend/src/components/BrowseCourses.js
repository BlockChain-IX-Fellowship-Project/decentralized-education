import React, { useEffect, useState } from 'react';
import { getAllCourses } from '../utils/getAllCourses';
import { useNavigate } from 'react-router-dom';

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then(data => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Browse Courses</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-6"
        placeholder="Search courses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="text-blue-600 font-semibold">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-gray-500">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:bg-blue-50 border border-gray-100"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div className="font-bold text-xl mb-2">{course.title}</div>
              <div className="text-gray-600 mb-2">{course.description}</div>
              <div className="text-xs text-gray-500">Sections: {course.sections?.length || 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
