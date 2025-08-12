"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("ongoing")
  const navigate = useNavigate()

  const ongoingCourses = [
    {
      id: 1,
      title: "Introduction to Blockchain",
      description: "Learn the fundamentals of blockchain technology",
      progress: 60,
      totalSections: 5,
      completedSections: 3,
      tokens: 150,
      instructor: "John Smith",
    },
    {
      id: 2,
      title: "DeFi Fundamentals",
      description: "Understanding decentralized finance protocols",
      progress: 25,
      totalSections: 6,
      completedSections: 1,
      tokens: 0,
      instructor: "Sarah Johnson",
    },
  ]

  const completedCourses = [
    {
      id: 6,
      title: "Blockchain Basics",
      description: "Introduction to blockchain concepts",
      tokensEarned: 100,
      completedDate: "2024-01-15",
      instructor: "Alex Chen",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
              <div className="flex items-center mt-2">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-600">550 Tokens Earned</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Profile Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-gray-100"
                onClick={() => navigate("/profile")}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden sm:inline">Liza Maharjan</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => navigate("/courses")}
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:from-green-600 hover:to-blue-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Courses</h3>
                <p className="text-green-100">Discover new learning opportunities</p>
              </div>
              <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Learning Progress</h3>
                <p className="text-gray-600">Track your course completion</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">75%</div>
                <div className="text-sm text-gray-500">Average Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ongoing"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Ongoing Courses ({ongoingCourses.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "completed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Completed Courses ({completedCourses.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Ongoing Courses */}
            {activeTab === "ongoing" && (
              <div className="space-y-6">
                {ongoingCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-2">{course.description}</p>
                        <p className="text-sm text-gray-500">By {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{course.tokens} tokens</div>
                        <div className="text-sm text-gray-500">Potential reward</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {course.completedSections}/{course.totalSections} sections
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Courses */}
            {activeTab === "completed" && (
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-2">{course.title}</h3>
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{course.description}</p>
                        <p className="text-xs text-gray-500">
                          By {course.instructor} • Completed on {course.completedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Certificate Earned
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{course.tokensEarned} tokens earned</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
