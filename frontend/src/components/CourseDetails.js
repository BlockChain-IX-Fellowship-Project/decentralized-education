import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User,  Play, CheckCircle, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const levelColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [watchedItems, setWatchedItems] = useState({});
  const [activeQuizIdx, setActiveQuizIdx] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sectionStatus, setSectionStatus] = useState({}); // { sectionId: 'completed' | 'incomplete' }

  const handleMarkAsWatched = (sectionIdx, type) => {
    setWatchedItems(prev => ({ ...prev, [`${sectionIdx}-${type}`]: true }));
  };

  const handleAnswerSelect = (sectionIdx, qIdx, option) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${sectionIdx}-${qIdx}`]: option
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleQuizComplete = (score, total, sectionId) => {
    if (score / total >= 0.8) { // 4/5 or 80%
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'completed' }));
    } else {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'incomplete' }));
    }
  };

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
  const instructor =  course.instructor
  const sections = course.sections || [];
  const level = course.level || "Beginner";

  // Calculate progress
  const completedSections = sections.filter(
    (section, idx) =>
      watchedItems[`${idx}-video`] &&
      section.quizzes &&
      section.quizzes.length > 0 &&
      watchedItems[`${idx}-quiz`]
  ).length;
  const totalSections = sections.length;
  const tokensPerSection = 50;
  const totalTokens = totalSections * tokensPerSection;
  const earnedTokens = completedSections * tokensPerSection;

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <button className="mb-4 text-blue-600 hover:underline flex items-center gap-2" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between border border-blue-100">
        <div className="flex-1 min-w-0">
          {/* <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{course.title}</h2> */}
          <div className="flex items-center gap-3 mb-2">
  <h2 className="text-3xl font-extrabold text-gray-900">{course.title}</h2>
  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColors[level]}`}>
    {level}
  </span>
</div>
          <p className="text-base text-gray-700 mb-3">{course.description}</p>
          <div className="text-sm text-gray-500 font-semibold mb-2">Instructor: <span className="text-blue-700 font-normal">{instructor}</span></div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-blue-700 font-semibold">Course Progress</span>
            <span className="text-sm text-blue-700 font-semibold">{completedSections}/{totalSections} sections completed</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div className="h-3 bg-black rounded-full transition-all duration-300" style={{ width: `${(completedSections / totalSections) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-w-[160px] mt-6 md:mt-0 md:ml-8">
          <div className="bg-gray-100 rounded-full px-8 py-6 text-center shadow text-2xl font-bold text-gray-900 mb-2 flex flex-col items-center">
            <span>{earnedTokens} / {totalTokens}</span>
            <span className="text-base font-semibold text-gray-700 mt-1">Tokens</span>
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-blue-900">Course Sections</h3>
      <div className="flex flex-col gap-4">
        {sections.length > 0 ? sections.map((section, idx) => {
          const isLocked = idx > 0 && !watchedItems[`${idx - 1}-video`];
          const isCompleted = watchedItems[`${idx}-video`] && section.quizzes && section.quizzes.length > 0 && watchedItems[`${idx}-quiz`];
          return (
            <div
              key={section._id || idx}
              className={`rounded-xl border bg-white border-blue-100 shadow-sm transition-all duration-200 px-6 py-4 mb-4 ${isLocked ? 'opacity-60' : ''} ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              style={isLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}}
            >
              {/* Header Row: Title, status, tokens */}
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow">{idx + 1}</span>
                  <span className="font-bold text-xl text-gray-900">{section.title}</span>
                  <span className="ml-2 text-xs text-gray-400 font-semibold">{isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available'}</span>
                </div>
                <div className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full text-right text-gray-900">{isCompleted ? '50 tokens earned' : '50 tokens available'}</div>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full">
                {/* Left: Video and Mark as Watched */}
                <div className="flex-1 min-w-0 md:pr-8">
                  <div className="flex items-center gap-2 text-xs text-blue-500 font-semibold mb-1 mt-1"><Play className="w-4 h-4" /> Video Lesson</div>
                  {section.videos && section.videos.length > 0 ? section.videos.map((video, vIdx) => (
                    <div style={{ pointerEvents: 'auto', opacity: 1, width: '100%' }} key={video._id || vIdx}>
                      <video
                        controls
                        width="100%"
                        className="mb-1 rounded-lg border border-blue-200 shadow bg-black"
                        src={`https://ipfs.io/ipfs/${video.ipfsHash}`}
                      />
                    </div>
                  )) : <div className="text-gray-400 text-xs">No video</div>}
                  <button
                    className={`w-full text-xs font-semibold py-2 rounded-lg mt-2 transition-all duration-150 ${watchedItems[`${idx}-video`] ? 'bg-blue-600 text-white cursor-default' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleMarkAsWatched(idx, 'video')}
                    disabled={watchedItems[`${idx}-video`] || isLocked}
                  >
                    {watchedItems[`${idx}-video`] ? <span><CheckCircle className="inline w-4 h-4 mr-1" /> Marked as Watched</span> : 'Mark as Watched'}
                  </button>
                  <div className="text-xs text-center text-gray-500 mt-1">Click to mark video as watched and unlock quiz</div>
                </div>
                {/* Right: Quiz and tokens */}
                <div className="flex-1 min-w-0 md:pl-8 flex flex-col items-start justify-between mt-6 md:mt-0">
                  <div className="flex items-center gap-2 text-xs text-purple-500 font-semibold mb-2"><Lock className="w-4 h-4" /> Section Quiz</div>
                  <button
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-150 mb-2 ${watchedItems[`${idx}-video`] ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!watchedItems[`${idx}-video`] || isLocked}
                    onClick={() => navigate(`/course/${id}/section/${section._id}/quiz`)}
                  >
                    {isCompleted ? 'Quiz Completed' : watchedItems[`${idx}-video`] ? 'Take Quiz' : 'Complete Materials First'}
                  </button>
                  <div className="text-xs text-center text-gray-500">Mark the video as watched to unlock the quiz</div>
                </div>
              </div>
            </div>
          );
        }) : <div className="text-gray-500">No sections found.</div>}
      </div>
    </div>
  );
}
