"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Play, CheckCircle, Lock, Trophy, Star, Clock, BookOpen, Award } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { getUserProgress } from "../utils/quizApi"
import { useWeb3Context } from "./hooks/Web3Context"
import { getUserByWallet, enrollCertificate, getCertificate } from '../utils/userApi';

const levelColors = {
  Beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
  Advanced: "bg-red-100 text-red-800 border-red-200",
}

const levelGradients = {
  Beginner: "from-emerald-50 to-green-100",
  Intermediate: "from-amber-50 to-yellow-100",
  Advanced: "from-red-50 to-pink-100",
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWeb3Context();
  const walletAddress = account || "";
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState(null)
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [certificate, setCertificate] = useState(null);
const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/api/courses/${id}`)
        if (!res.ok) throw new Error("Failed to fetch course")
        const data = await res.json()
        setCourse(data)
      } catch (err) {
        setCourse(null)
      }
      setLoading(false)
    }
    fetchCourse()
  }, [id])

  useEffect(() => {
    async function fetchProgress() {
      if (account && course?._id) {
        const progress = await getUserProgress({ userId: account, courseId: course._id })
        setUserProgress(progress)
      }
    }
    fetchProgress()

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchProgress()
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [account, course?._id])

  useEffect(() => {
    async function fetchCertificate() {
      if (walletAddress && course?._id) {
        const cert = await getCertificate({ walletAddress, courseId: course._id });
        setCertificate(cert);
      } else {
        setCertificate(null);
      }
    }
    fetchCertificate();
  }, [walletAddress, course?._id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 font-semibold">Loading course details...</div>
        </div>
      </div>
    )

  if (!course)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Browse Courses
          </Link>
        </div>
      </div>
    )

  const instructor = course.instructor
  const sections = course.sections || []
  const level = course.level || "Beginner"

  const sectionStatuses = userProgress?.sectionStatuses || []
  const sectionStatusMap = {}
  sectionStatuses.forEach((s) => {
    sectionStatusMap[s.sectionId?.toString()] = {
      status: s.status,
      score: s.score,
      total: s.total,
    }
  })

  const completedSections = sections.filter((section) => sectionStatusMap[section._id]?.status === "completed").length
  const totalSections = sections.length
  const scorePerSection = level === "Beginner" ? 50 : level === "Intermediate" ? 70 : 100
  const totalScore = totalSections * scorePerSection
  const earnedScore = userProgress?.totalScore || 0
  const isCourseCompleted = userProgress?.courseStatus === "completed";

  async function handleGetCertificate() {
    setEnrollLoading(true);
    setEnrollSuccess(false);
    setEnrollError("");
    try {
      const user = await getUserByWallet(walletAddress);
      if (!user || !user.name) {
        setEnrollError("User name not found. Please update your profile.");
        setEnrollLoading(false);
        return;
      }
      const data = await enrollCertificate({
        learnerName: user.name,
        walletAddress,
        courseId: course._id,
      });
      if (data.success && data.ipfsUrl) {
        setEnrollSuccess(true);
        setEnrollError("");
        window.open(data.ipfsUrl, "_blank");
        // Re-fetch certificate so button updates
        const cert = await getCertificate({ walletAddress, courseId: course._id });
        setCertificate(cert);
      } else {
        setEnrollSuccess(false);
        setEnrollError("Certificate request failed. Please try again.");
      }
    } catch (err) {
      setEnrollSuccess(false);
      setEnrollError("Certificate request failed. Please try again.");
    }
    setEnrollLoading(false);
  }

  function handleViewCertificate() {
    if (certificate?.downloadUrl) {
      window.open(certificate.downloadUrl, "_blank");
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Button>

      {/* Show certificate button only if completed */}
      {isCourseCompleted && (
        <div className="mb-6 flex justify-end">
          {certificate ? (
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all"
              onClick={handleViewCertificate}
            >
              View Certificate
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all"
              onClick={handleGetCertificate}
              disabled={enrollLoading}
            >
              {enrollLoading ? "Processing..." : "Get Your Certificate"}
            </Button>
          )}
        </div>
      )}
      {enrollSuccess && (
        <div className="text-green-600 text-center mb-4">Certificate request successful!</div>
      )}
      {enrollError && (
        <div className="text-red-600 text-center mb-4">{enrollError}</div>
      )}

      {/* Course Header Card */}
      <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-white to-blue-50">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
                <Badge className={`text-sm font-semibold px-4 py-2 border ${levelColors[level]}`}>{level}</Badge>
              </div>

              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Instructor:</span>
                <span className="font-semibold text-blue-700">{instructor}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {completedSections}/{totalSections} sections completed
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedSections / totalSections) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((completedSections / totalSections) * 100)}% complete
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center shadow-lg border border-yellow-300">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{earnedScore}</div>
                <div className="text-sm text-gray-600 mb-2">of {totalScore} score</div>
                <div className="text-xs text-yellow-700 font-medium">
                  {Math.round((earnedScore / totalScore) * 100)}% earned
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Course Sections</h2>
        <Badge variant="secondary" className="text-sm">
          {sections.length} sections
        </Badge>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.length > 0 ? (
          sections.map((section, idx) => {
            const statusObj = sectionStatusMap[section._id] || { status: "not_started", score: 0, total: 0 }
            const isCompleted = statusObj.status === "completed"
            const isInProgress = statusObj.status === "in_progress"
            const isLocked = idx > 0 && sectionStatusMap[sections[idx - 1]._id]?.status !== "completed"

            return (
              <Card
                key={section._id || idx}
                className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500"
                    : isLocked
                      ? "bg-gray-50 opacity-75"
                      : "bg-white hover:bg-blue-50/50"
                }`}
              >
                <CardContent className="p-6">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isLocked
                              ? "bg-gray-300 text-gray-500"
                              : "bg-blue-500 text-white"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isCompleted ? "default" : isLocked ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {isCompleted
                              ? "Completed"
                              : isLocked
                                ? "Locked"
                                : isInProgress
                                  ? "In Progress"
                                  : "Available"}
                          </Badge>
                          {isCompleted && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">
                                {statusObj.score}/{statusObj.total}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isCompleted ? `${scorePerSection} score earned` : `${scorePerSection} score available`}
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Video Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                        <Play className="w-5 h-5" />
                        <span>Video Lesson</span>
                      </div>
                      {section.videos && section.videos.length > 0 ? (
                        section.videos.map((video, vIdx) => (
                          <div key={video._id || vIdx} className="relative">
                            <video
                              controls
                              className="w-full rounded-lg border-2 border-blue-200 shadow-md bg-black"
                              src={`https://ipfs.io/ipfs/${video.ipfsHash}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                          No video available
                        </div>
                      )}
                    </div>

                    {/* Quiz Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-purple-600 font-semibold mb-3">
                        {/* Changed: Only show lock icon for actually locked sections */}
                        {isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : isCompleted ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                        <span>Section Quiz</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        {/* Last Score Display */}
                        {(isCompleted || (isInProgress && statusObj.total > 0)) && (
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Last Score:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`text-lg font-bold ${isCompleted ? "text-green-600" : "text-orange-600"}`}
                                >
                                  {statusObj.score}/{statusObj.total}
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    isCompleted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {Math.round((statusObj.score / statusObj.total) * 100)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quiz Button - Changed: Always allow retake for completed sections */}
                        <Button
                          className={`w-full py-3 font-semibold transition-all duration-200 ${
                            isLocked
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : isCompleted
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                          }`}
                          disabled={isLocked}
                          onClick={() => navigate(`/course/${id}/section/${section._id}/quiz`)}
                        >
                          {isLocked ? (
                            <div className="flex items-center justify-center gap-2">
                              <Lock className="w-5 h-5" />
                              Locked
                            </div>
                          ) : isCompleted ? (
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="w-5 h-5" />
                              Retake Quiz
                            </div>
                          ) : isInProgress ? (
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="w-5 h-5" />
                              Continue Quiz
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Play className="w-5 h-5" />
                              Take Quiz
                            </div>
                          )}
                        </Button>

                        {/* Status Message */}
                        <div className="text-center text-sm text-gray-600">
                          {isCompleted
                            ? "Quiz completed! You can retake it to improve your score."
                            : isLocked
                              ? "Complete the previous section to unlock this quiz."
                              : isInProgress && statusObj.total > 0
                                ? "You can continue or retake the quiz to improve your score."
                                : "Complete the quiz to earn scores and progress."}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 text-lg">No sections found for this course.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
