import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useWeb3Context } from "./hooks/Web3Context"

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()
  const { account } = useWeb3Context()

  // Redirect to wallet if not connected
  useEffect(() => {
    if (!account) {
      navigate("/wallet")
    }
  }, [account, navigate])

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      // Save role to localStorage for persistence
      localStorage.setItem("userRole", selectedRole)
      localStorage.setItem("hasSelectedRole", "true")
      
      // Redirect to role-specific dashboard
      if (selectedRole === "student") {
        navigate("/student/dashboard")
      } else if (selectedRole === "instructor") {
        navigate("/instructor/dashboard")
      } else {
        navigate("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to De-Education Platform</h1>
          <p className="text-lg text-gray-600">Choose your role to get started with your learning journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Student Card */}
          <div
            className={`bg-white rounded-xl p-8 border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === "student"
                ? "border-blue-500 shadow-lg transform scale-105"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Learner</h3>
              <p className="text-gray-600 mb-6">I want to explore and learn from courses created by instructors</p>

              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Browse available courses</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Track learning progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Earn learning tokens</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Get blockchain certificates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div
            className={`bg-white rounded-xl p-8 border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === "instructor"
                ? "border-green-500 shadow-lg transform scale-105"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => handleRoleSelect("instructor")}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Contributor</h3>
              <p className="text-gray-600 mb-6">I want to create and share educational content with learners</p>

              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Create new courses</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Manage course content</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Track student progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Earn from teaching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              selectedRole ? "bg-gray-900 hover:bg-gray-800 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue as{" "}
            {selectedRole === "student" ? "Learner" : selectedRole === "instructor" ? "Contributor" : "User"}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Your security is our priority</h4>
              <p className="text-sm text-gray-600 mt-1">
                We never store your private keys. Your wallet remains under your complete control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection 