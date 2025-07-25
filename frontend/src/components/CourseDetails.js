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
  const sections = course.sections || [];
  const duration = course.duration || "-";
  const level = course.level || "Beginner";
  const requirements = course.requirements || [];
  const whatYouWillLearn = course.whatYouWillLearn || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <button className="mb-4 text-blue-600 hover:underline flex items-center gap-2" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      {/* Custom styled text card for course preview */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-lg p-10 mb-10 flex flex-col items-center justify-center border border-blue-200">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg">{course.title}</h2>
        <p className="text-lg text-gray-700 mb-4 text-center font-medium">{course.description}</p>
        <div className="text-sm text-gray-500 font-semibold">Instructor: <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full ml-1">{instructor}</span></div>
      </div>
      <h3 className="text-2xl font-bold mb-6 text-blue-900">Course Sections</h3>
      <div className="space-y-8">
      {sections.length > 0 ? sections.map((section, idx) => {
        const isLocked = idx > 0 && !watchedItems[`${idx - 1}-video`];
        const isCompleted = watchedItems[`${idx}-video`];
        return (
          <div
            key={section._id || idx}
            className={`rounded-2xl p-8 border flex flex-col gap-4 bg-white border-blue-200 shadow-md transition-all duration-200 hover:shadow-xl ${isLocked ? 'opacity-60' : ''}`}
            style={isLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}}
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-block w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow">{idx + 1}</span>
              <div>
                <div className="font-bold text-2xl flex items-center gap-2 text-blue-900">{section.title}</div>
                {section.description && (
                  <div className="text-gray-600 text-base mt-1 italic">{section.description}</div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-8 items-start mt-2">
              <div className="flex flex-col items-start w-64">
                <div className="flex items-center gap-2 text-xs text-blue-500 mb-2 font-semibold"><Play className="w-4 h-4" /> Video Lesson</div>
                {section.videos && section.videos.length > 0 ? section.videos.map((video, vIdx) => (
                  <div style={{ pointerEvents: 'auto', opacity: 1, width: '100%' }} key={video._id || vIdx}>
                    <video
                      controls
                      width="260"
                      className="mb-2 rounded-lg border border-blue-200 shadow"
                      src={`https://ipfs.io/ipfs/${video.ipfsHash}`}
                    />
                  </div>
                )) : <div className="text-gray-400 text-xs">No video</div>}
                <button
                  className={`w-full text-xs font-semibold py-2 rounded-lg mt-2 transition-all duration-150 ${watchedItems[`${idx}-video`] ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleMarkAsWatched(idx, 'video')}
                  disabled={watchedItems[`${idx}-video`] || isLocked}
                >
                  {watchedItems[`${idx}-video`] ? <span><CheckCircle className="inline w-4 h-4 mr-1" /> Watched</span> : 'Mark as Watched'}
                </button>
              </div>
              <div className="flex flex-col items-start w-64">
                <div className="flex items-center gap-2 text-xs text-purple-500 mb-2 font-semibold"><Lock className="w-4 h-4" /> Section Quiz</div>
                <button
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${watchedItems[`${idx}-video`] ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  disabled={!watchedItems[`${idx}-video`] || isLocked}
                  onClick={() => navigate(`/course/${id}/section/${section._id}/quiz`)}
                >
                  {watchedItems[`${idx}-video`] ? 'Take Quiz' : 'Complete video first'}
                </button>
              </div>
            </div>
          </div>
        );
      }) : <div className="text-gray-500">No sections found.</div>}
      </div>
      {activeQuizIdx !== null && sections[activeQuizIdx].quizzes && sections[activeQuizIdx].quizzes.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Section Quiz</h2>
            {sections[activeQuizIdx].quizzes.map((q, qIdx) => (
              <div key={qIdx} className="mb-4">
                <div className="font-semibold mb-2">{q.question}</div>
                {q.options.map((opt, optIdx) => (
                  <label key={optIdx} className="block mb-1">
                    <input
                      type="radio"
                      name={`quiz-${activeQuizIdx}-${qIdx}`}
                      value={opt}
                      checked={userAnswers[`${activeQuizIdx}-${qIdx}`] === opt}
                      onChange={() => handleAnswerSelect(activeQuizIdx, qIdx, opt)}
                      disabled={quizSubmitted}
                    />{" "}
                    {opt}
                  </label>
                ))}
                {quizSubmitted && (
                  <div className={`mt-1 text-sm ${userAnswers[`${activeQuizIdx}-${qIdx}`] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {userAnswers[`${activeQuizIdx}-${qIdx}`] === q.correctAnswer ? 'Correct!' : `Incorrect. Correct: ${q.correctAnswer}`}
                  </div>
                )}
              </div>
            ))}
            {!quizSubmitted ? (
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold" onClick={handleSubmitQuiz}>
                Submit Quiz
              </button>
            ) : (
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold" onClick={() => { setActiveQuizIdx(null); setQuizSubmitted(false); setUserAnswers({}); }}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
