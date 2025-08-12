import React, { useEffect, useState } from "react";
import { getAllCourses } from "../utils/getAllCourses";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, BookOpen, User } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const levelColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function BrowseCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllCourses()
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
            <p className="text-gray-600">Discover new learning opportunities and expand your knowledge</p>
          </div>
        </div>

        <div className="w-full md:max-w-3xl mx-auto mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
            <Input
              placeholder="Search for courses, topics, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setSelectedLevel("All")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedLevel === "All" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setSelectedLevel("Beginner")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedLevel === "Beginner" ? "bg-green-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setSelectedLevel("Intermediate")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedLevel === "Intermediate"
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setSelectedLevel("Advanced")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedLevel === "Advanced" ? "bg-red-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-blue-600 font-semibold text-center py-12">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <Link key={course._id || course.id} to={`/course/${course._id || course.id}`}>
                <Card className="relative bg-white h-full hover:shadow-2xl transition-shadow cursor-pointer group border border-gray-200 hover:border-blue-400 p-8 rounded-3xl min-h-[280px] flex flex-col justify-between transform hover:scale-[1.025] duration-200 shadow-green-200">
                  <CardHeader className="pb-4 pt-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-3">
                      <CardTitle className="text-2xl font-extrabold group-hover:text-blue-600 transition-colors">{course.title}</CardTitle>
                      <Badge className={levelColors[course.level] || "bg-gray-100 text-gray-800"} style={{fontSize: '1rem', padding: '0.4em 1em'}}>{course.level}</Badge>
                    </div>
                    <CardDescription className="text-base text-gray-600 line-clamp-2 mb-2 font-medium">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col gap-4 mt-auto">
                    <div className="flex items-center gap-2 text-base text-gray-500 justify-center">
                      <User className="w-5 h-5" />
                      {course.instructor || "Unknown"}
                    </div>
                    <div className="flex items-center gap-2 text-base text-gray-500 justify-center">
                      <BookOpen className="w-5 h-5" />
                      {course.sections?.length || course.sections || 0} sections
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
