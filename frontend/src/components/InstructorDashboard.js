"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses")
  const navigate = useNavigate()

  const myCourses = [
    {
      id: 1,
      title: "Introduction to Blockchain",
      description: "Learn the fundamentals of blockchain technology",
      students: 245,
      sections: 5,
      status: "Published",
      earnings: 1250,
      rating: 4.8,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description: "Build and deploy smart contracts on Ethereum",
      students: 89,
      sections: 8,
      status: "Published",
      earnings: 890,
      rating: 4.6,
      lastUpdated: "2024-01-10",
    },
    {
      id: 3,
      title: "Advanced DeFi Protocols",
      description: "Deep dive into decentralized finance",
      students: 0,
      sections: 6,
      status: "Draft",
      earnings: 0,
      rating: 0,
      lastUpdated: "2024-01-20",
    },
  ]

  const stats = {
    totalStudents: 334,
    totalEarnings: 2140,
    totalCourses: 3,
    avgRating: 4.7,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your courses and track your teaching impact</p>
              <button 
                onClick={() => {
                  localStorage.removeItem("userRole");
                  localStorage.removeItem("hasSelectedRole");
                  window.location.reload();
                }}
                className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
              >
                Reset Role
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate("/instructor/add-course")}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Create New Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEarnings} tokens</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => navigate("/instructor/add-course")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Create New Course</h3>
                <p className="text-purple-100">Share your knowledge with the community</p>
              </div>
              <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Analytics</h3>
                <p className="text-gray-600">View detailed performance metrics</p>
              </div>
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "courses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Courses ({myCourses.length})
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Instructor Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* My Courses Tab */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                {myCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">{course.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              course.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{course.description}</p>
                        <p className="text-sm text-gray-500">Last updated: {course.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{course.earnings} tokens</div>
                        <div className="text-sm text-gray-500">Total earnings</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{course.students}</div>
                        <div className="text-sm text-gray-500">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{course.sections}</div>
                        <div className="text-sm text-gray-500">Sections</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900 mr-1">{course.rating}</span>
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Course
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        View Analytics
                      </button>
                      {course.status === "Draft" && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                      JD
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                      <p className="text-gray-600">Blockchain Developer & Educator</p>
                      <p className="text-sm text-gray-500">Member since January 2024</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Tell students about yourself and your expertise..."
                      defaultValue="Experienced blockchain developer with 5+ years in the industry. Passionate about teaching and sharing knowledge about decentralized technologies."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {["Blockchain", "Smart Contracts", "DeFi", "Web3", "Solidity"].map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://twitter.com/johndoe"
                      />
                    </div>
                  </div>

                  <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard 