import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SectionQuiz() {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    async function fetchSection() {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      const data = await res.json();
      const foundSection = data.sections.find(s => s._id === sectionId);
      setSection(foundSection);
    }
    fetchSection();
  }, [courseId, sectionId]);

  if (!section) return <div>Loading...</div>;
  const quiz = section.quizzes || [];
  const q = quiz[currentQ];

  const handleAnswer = (option) => {
    setUserAnswers({ ...userAnswers, [currentQ]: option });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentQ(currentQ + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {currentQ < quiz.length ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Question {currentQ + 1} of {quiz.length}</h2>
            <div className="mb-6 text-lg font-semibold text-gray-800 text-center">{q.question}</div>
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`block w-full text-left px-5 py-3 rounded-lg border transition-all duration-150 font-medium text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${userAnswers[currentQ] === opt ? 'bg-purple-100 border-purple-400 text-purple-900' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'}`}
                  disabled={showFeedback}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showFeedback && (
              <div className={`mt-4 text-center text-lg font-semibold ${userAnswers[currentQ] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {userAnswers[currentQ] === q.correctAnswer ? 'Correct!' : `Incorrect. Correct: ${q.correctAnswer}`}
              </div>
            )}
            {showFeedback && (
              <button className="mt-6 w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-bold shadow hover:bg-purple-700 transition-all duration-150" onClick={handleNext}>
                Next
              </button>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Quiz Complete!</h2>
            <div className="mb-6 text-lg font-semibold text-gray-800">Score: {quiz.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length} / {quiz.length}</div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-all duration-150" onClick={() => navigate(-1)}>
              Back to Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
