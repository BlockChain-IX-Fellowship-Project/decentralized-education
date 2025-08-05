import React from 'react';
import { useNavigate } from 'react-router-dom';

const dummyCourses = [
  {
    id: 1,
    title: 'Introduction to Blockchain',
    description: 'Learn the fundamentals of blockchain technology',
    progress: 3,
    total: 5,
    tokens: 150,
  },
  {
    id: 2,
    title: 'DeFi Fundamentals',
    description: 'Understanding decentralized finance protocols',
    progress: 0,
    total: 6,
    tokens: 0,
  },
];

const completedCourses = [
  {
    id: 3,
    title: 'Smart Contract Development',
    description: 'Build and deploy smart contracts on Ethereum',
    tokens: 400,
  },
];

export default function Dashboard({ onAddCourse, onCourseClick }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">
        {userRole === "instructor" ? "Instructor Dashboard" : "Learning Dashboard"}
      </h1>
      <div className="flex items-center mb-6">
        <span className="font-medium flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700">
          <span className="mr-2">🔗</span> 550 Tokens Earned
        </span>
        <span className="ml-4 font-medium flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-700">
          <span className="mr-2">👤</span> {userRole === "instructor" ? "Contributor" : "Learner"}
        </span>
        <button 
          onClick={() => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("hasSelectedRole");
            window.location.reload();
          }}
          className="ml-4 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
        >
          Reset Role
        </button>
      </div>
      <div className="flex gap-6 mb-8">
        {userRole === "instructor" ? (
          <>
            <div
              className="flex-1 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer py-10 hover:bg-blue-100 transition"
              onClick={onAddCourse}
            >
              <div className="text-4xl text-blue-400 mb-2">+</div>
              <div className="font-semibold text-lg">Create New Course</div>
              <div className="text-gray-500 text-sm">Share your knowledge with the community</div>
            </div>
            <div className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex flex-col items-center justify-center py-10 text-white cursor-pointer" onClick={() => navigate('/courses')}>
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-lg">Manage Courses</div>
              <div className="text-sm">View and edit your created courses</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex flex-col items-center justify-center py-10 text-white cursor-pointer" onClick={() => navigate('/courses')}>
              <div className="text-3xl mb-2">📖</div>
              <div className="font-semibold text-lg">Browse Courses</div>
              <div className="text-sm">Discover new learning opportunities</div>
            </div>
            <div className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex flex-col items-center justify-center py-10 text-white cursor-pointer">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold text-lg">My Certificates</div>
              <div className="text-sm">View your earned certificates</div>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            {userRole === "instructor" ? "My Created Courses" : "My Courses"}
          </h2>
          {userRole === "instructor" ? (
            <div className="mb-4">
              <div className="font-semibold mb-2">Active Courses</div>
              {dummyCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow p-4 mb-3 cursor-pointer hover:bg-blue-50 border border-gray-100"
                  onClick={() => onCourseClick(course)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold">{course.title}</div>
                    <div className="bg-green-100 px-2 py-1 rounded text-xs font-semibold text-green-700">Active</div>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">{course.description}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📚 {course.total} sections</span>
                    <span>👥 24 students enrolled</span>
                    <span>⭐ 4.8 rating</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="font-semibold mb-2">Ongoing Courses</div>
                {dummyCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow p-4 mb-3 cursor-pointer hover:bg-blue-50 border border-gray-100"
                    onClick={() => onCourseClick(course)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold">{course.title}</div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{course.tokens} tokens</div>
                    </div>
                    <div className="text-gray-600 text-sm mb-2">{course.description}</div>
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(course.progress / course.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right text-gray-500">
                      {course.progress}/{course.total} sections
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-semibold mb-2">Completed Courses</div>
                {completedCourses.map((course) => (
                  <div key={course.id} className="bg-green-50 rounded-lg p-4 mb-3 border border-green-200">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold">{course.title} <span className="ml-1">🏆</span></div>
                      <div className="bg-green-100 px-2 py-1 rounded text-xs font-semibold">{course.tokens} tokens</div>
                    </div>
                    <div className="text-gray-600 text-sm mb-2">{course.description}</div>
                    <div className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Certificate Earned</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            {userRole === "instructor" ? "Course Analytics" : "Take New Courses"}
          </h2>
          {userRole === "instructor" ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="font-bold text-lg mb-2">📊 Course Performance</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">18</div>
                    <div className="text-gray-600">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.8</div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">75%</div>
                    <div className="text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="font-bold text-lg mb-2">💰 Earnings</div>
                <div className="text-3xl font-bold text-green-600 mb-2">2.4 ETH</div>
                <div className="text-sm text-gray-600">Total earnings from course sales</div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-3 flex flex-col gap-2">
                <div className="font-bold">NFT Creation and Trading</div>
                <div className="text-gray-600 text-sm">Learn how to create and trade NFTs</div>
                <div className="flex items-center gap-2 text-xs">
                  <span>4 sections</span>
                  <span>• By David Wilson</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-auto">Beginner</span>
                </div>
                <button className="bg-black text-white px-4 py-1 rounded mt-2 self-end">Enroll</button>
              </div>
              <div className="bg-white rounded-lg shadow p-4 mb-3 flex flex-col gap-2">
                <div className="font-bold">Cryptocurrency Trading</div>
                <div className="text-gray-600 text-sm">Master the art of crypto trading</div>
                <div className="flex items-center gap-2 text-xs">
                  <span>10 sections</span>
                  <span>• By Emma Brown</span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full ml-auto">Advanced</span>
                </div>
                <button className="bg-black text-white px-4 py-1 rounded mt-2 self-end">Enroll</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
