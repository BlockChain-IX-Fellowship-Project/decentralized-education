import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SectionQuiz() {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

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
    if (currentQ + 1 < quiz.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const score = quiz.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-2">
        <div className="w-full max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              {score === quiz.length ? (
                <span className="text-green-500 text-5xl mb-2">✔️</span>
              ) : (
                <span className="text-red-500 text-5xl mb-2">❌</span>
              )}
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{score === quiz.length ? 'Quiz Passed' : 'Quiz Failed'}</h2>
              <div className="text-gray-600 mb-2">Smart Contracts Basics Quiz Results</div>
              <div className="text-3xl font-bold mb-1">{score}/{quiz.length}</div>
              <div className="text-lg text-gray-700 mb-4">{Math.round((score/quiz.length)*100)}% Score</div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Review Your Answers:</h3>
              {quiz.map((q, idx) => {
                const correct = userAnswers[idx] === q.correctAnswer;
                return (
                  <div key={idx} className={`mb-4 p-4 rounded-lg ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}> 
                    <div className={`font-semibold mb-1 flex items-center gap-2 ${correct ? 'text-green-700' : 'text-red-700'}`}>{correct ? '✔️' : '❌'} {q.question}</div>
                    <div className="text-sm mb-1">Your answer: <span className="font-medium">{userAnswers[idx]}</span></div>
                    {!correct && (
                      <div className="text-sm text-green-700">Correct answer: <span className="font-medium">{q.correctAnswer}</span></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-900 text-white px-5 py-2 rounded font-semibold" onClick={() => { setShowResults(false); setCurrentQ(0); setUserAnswers({}); }}>Retake Quiz</button>
              <button className="bg-gray-200 text-gray-900 px-5 py-2 rounded font-semibold" onClick={() => navigate(-1)}>Back to Course</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-2">
      <div className="w-full max-w-xl mx-auto mt-8">
        <button
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline font-semibold text-base"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Course
        </button>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Smart Contracts Basics Quiz</h2>
            <div className="text-sm font-semibold text-gray-600 bg-blue-100 px-3 py-1 rounded-full shadow">Question {currentQ + 1} of {quiz.length}</div>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full mb-8">
            <div className="h-2 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / quiz.length) * 100}%` }}></div>
          </div>
          {!showResults && currentQ < quiz.length ? (
            <>
              <div className="mb-6 text-lg font-semibold text-gray-800">{q.question}</div>
              <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (userAnswers[currentQ]) handleAnswer(userAnswers[currentQ]); }}>
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`block w-full px-5 py-3 rounded-lg border transition-all duration-150 font-medium text-base shadow-sm cursor-pointer select-none
                      ${userAnswers[currentQ] === opt ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-400' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ}`}
                      value={opt}
                      checked={userAnswers[currentQ] === opt}
                      onChange={() => setUserAnswers({ ...userAnswers, [currentQ]: opt })}
                      className="mr-3 accent-blue-600"
                    />
                    {opt}
                  </label>
                ))}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-900 px-5 py-2 rounded font-semibold"
                    onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                    disabled={currentQ === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className={`bg-blue-600 text-white px-5 py-2 rounded font-semibold ${!userAnswers[currentQ] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={!userAnswers[currentQ]}
                  >
                    {currentQ + 1 === quiz.length ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              </form>
            </>
          ) : null}
          {showResults && (
            <div className="flex flex-col items-center mb-6">
              {score === quiz.length ? (
                <span className="text-green-500 text-5xl mb-2">✔️</span>
              ) : (
                <span className="text-red-500 text-5xl mb-2">❌</span>
              )}
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{score === quiz.length ? 'Quiz Passed' : 'Quiz Failed'}</h2>
              <div className="text-gray-600 mb-2">Smart Contracts Basics Quiz Results</div>
              <div className="text-3xl font-bold mb-1">{score}/{quiz.length}</div>
              <div className="text-lg text-gray-700 mb-4">{Math.round((score/quiz.length)*100)}% Score</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
