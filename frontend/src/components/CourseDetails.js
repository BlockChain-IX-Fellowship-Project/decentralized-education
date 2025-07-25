import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User,  Play, CheckCircle, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const levelColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setCourse(null);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-600 font-semibold text-center">Loading course details...</div>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            ← Back to Browse Courses
          </Link>
        </div>
      </div>
    );

  // Fallbacks for missing backend fields
  const instructor = course.createdBy || course.instructor || "Unknown";
  const instructorBio = course.instructorBio || "";
  const students = course.students || 0;
  const rating = course.rating || "-";
  const sections = course.sections || [];
  const duration = course.duration || "-";
  const level = course.level || "Beginner";
  const image = course.image || "/placeholder.svg";
  const requirements = course.requirements || [];
  const whatYouWillLearn = course.whatYouWillLearn || [];
  const progress = course.progress || 0;
  // For curriculum, fallback to sections if curriculum is not present
  const curriculum = course.curriculum || (Array.isArray(sections)
    ? sections.map((section, idx) => ({
        id: section._id || idx + 1,
        title: section.title || `Section ${idx + 1}`,
        duration: section.duration || "-",
        completed: false,
        locked: idx > 0, // Only first section unlocked by default
      }))
    : []);

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge className={`${levelColors[level]} mb-3`}>{level}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                  <p className="text-gray-600 text-lg mb-4">{course.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {instructor}
                    </div>
                  </div>
                </div>
                {/* Remove tokens display */}
              </div>

              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    <Play className="w-5 h-5 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="curriculum" className="bg-white rounded-lg shadow-sm">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="p-6">
                <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
                <div className="space-y-5">
                  {curriculum.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-5 rounded-xl ${
                        lesson.locked
                          ? "bg-gray-50 text-gray-400"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Play className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${lesson.locked ? "text-gray-400" : "text-gray-900"}`}>
                            {index + 1}. {lesson.title}
                          </h4>
                        </div>
                      </div>
                      <span className={`text-base font-medium ${lesson.locked ? "text-gray-400" : "text-gray-600"}`}>
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {instructor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{instructor}</h3>
                    <p className="text-gray-600 mb-4">{instructorBio}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>⭐ 4.8 instructor rating</span>
                      <span>👥 {students} students</span>
                      <span>🎓 12 courses</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-xl border border-gray-200 shadow-none p-6 flex flex-col items-center">
              <CardHeader className="w-full p-0 mb-4">
                <CardTitle className="text-center text-2xl font-bold w-full">Enroll in Course</CardTitle>
              </CardHeader>
              <CardContent className="w-full p-0 flex flex-col items-center">
                <div className="space-y-4 w-full">
                  <div className="flex justify-between w-full text-base">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{duration}</span>
                  </div>
                  <div className="flex justify-between w-full text-base">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-semibold">{Array.isArray(sections) ? sections.length : sections}</span>
                  </div>
                  <div className="flex justify-between w-full text-base items-center">
                    <span className="text-gray-600">Level:</span>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm shadow-none">{level}</Badge>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-black text-white hover:bg-gray-900 text-base font-semibold py-3 rounded-lg" size="lg" onClick={handleEnroll} disabled={isEnrolled}>
                  {isEnrolled ? "Enrolled ✓" : "Enroll Now"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-4">30-day money-back guarantee</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
