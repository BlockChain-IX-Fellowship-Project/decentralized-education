"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { useWeb3Context } from "./hooks/Web3Context"
import { getUserByWallet, createOrUpdateUser, getUserCertificates } from "../utils/userApi"
import { getDashboardSummary } from "../utils/dashboardApi"

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { account } = useWeb3Context()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    bio: "",
    totalTokens: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
  })

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    bio: "",
  })

  useEffect(() => {
    async function loadProfile() {
      if (!account) return
      // 1) Load user profile first (do not let other requests override this)
      try {
        const user = await getUserByWallet(account)
        setUserProfile((prev) => ({
          ...prev,
          name: user?.name || "",
          email: user?.email || "",
          bio: user?.bio || "",
        }))
        setEditForm({
          name: user?.name || "",
          email: user?.email || "",
          bio: user?.bio || "",
        })
      } catch (e) {
        const shortAddr = `${account.slice(0, 6)}...${account.slice(-4)}`
        setUserProfile((prev) => ({ ...prev, name: shortAddr, email: "" }))
        setEditForm({ name: shortAddr, email: "", bio: "" })
      }

      // 2) Load dashboard summary (errors here should not affect name/email display)
      try {
        const summary = await getDashboardSummary(account)
        setUserProfile(prev => ({
          ...prev,
          totalTokens: summary?.totalTokens || 0,
          coursesCompleted: (summary?.completedCourses || []).length,
          coursesInProgress: (summary?.ongoingCourses || []).length,
        }))
        setCompletedCourses(summary?.completedCourses || [])
      } catch (_) { /* ignore */ }

      // 3) Load user certificates (ignore errors)
      try {
        const certs = await getUserCertificates(account)
        const mapped = certs.map(c => ({
          id: c._id,
          courseName: c.courseId?.title || c.courseId || 'Course',
          issueDate: c.issueDate ? new Date(c.issueDate).toISOString().slice(0,10) : '',
          instructor: '',
          tokensEarned: undefined,
          certificateUrl: c.downloadUrl || (c.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${c.ipfsHash}` : ''),
        }))
        if (mapped.length > 0) setCertificates(mapped)
      } catch (_) { /* ignore */ }
    }
    loadProfile()
  }, [account])

  const [certificates, setCertificates] = useState([])

  const [completedCourses, setCompletedCourses] = useState([])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      bio: userProfile.bio,
    })
  }

  const handleSave = async () => {
    try {
      const walletAddress = account
      if (walletAddress) {
        await createOrUpdateUser({ walletAddress, name: editForm.name, email: editForm.email, bio: editForm.bio })
      }
      setUserProfile({
        ...userProfile,
        ...editForm,
      })
      setIsEditing(false)
    } catch (e) {
      // no-op
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      bio: userProfile.bio,
    })
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={imagePreview || "/placeholder-user.png"} />
                        <AvatarFallback className="text-2xl">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-2xl font-bold"
                            placeholder="Enter your name"
                          />
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <Input
                              value={editForm.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="text-gray-600"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{userProfile.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit} variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {userProfile.bio || "No bio added yet. Click 'Edit Profile' to add your bio."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Certificates
                </CardTitle>
                <CardDescription>Your earned certificates and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex items-start justify-between">
                                                     <div>
                             <h4 className="font-semibold text-lg">{cert.courseName}</h4>
                             <p className="text-sm text-gray-600">Instructor: {cert.instructor}</p>
                           </div>
                            <div className="text-right flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.open(cert.certificateUrl || '#', '_blank')}
                              >
                                View Certificate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate('/verify')}
                              >
                                Verify on Blockchain
                              </Button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No certificates earned yet. Complete courses to earn your first certificate!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Completed Courses Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Completed Courses
                </CardTitle>
                <CardDescription>Courses you have successfully completed</CardDescription>
              </CardHeader>
              <CardContent>
                {completedCourses.length > 0 ? (
                  <div className="space-y-4">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                                                     <div>
                             <h4 className="font-semibold text-lg">{course.title}</h4>
                             <p className="text-gray-600 mb-1">{course.description}</p>
                             <p className="text-sm text-gray-500">
                               By {course.instructor}
                             </p>
                           </div>
                          <div className="text-right">
                            {course.certificateEarned && (
                              <Badge className="bg-green-500 hover:bg-green-600 mb-2">Certified</Badge>
                            )}
                            <p className="text-sm font-medium text-green-600">{course.tokensEarned} tokens earned</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No completed courses yet. Start learning to see your achievements here!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">Total Tokens</span>
                  </div>
                  <span className="font-semibold">{userProfile.totalTokens}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-semibold">{userProfile.coursesCompleted}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="font-semibold">{userProfile.coursesInProgress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent"
                  onClick={() => navigate("/")}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 