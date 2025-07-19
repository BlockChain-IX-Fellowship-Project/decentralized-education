import React, { useState } from 'react';

const allSections = [
  {
    title: 'What is Blockchain?',
    status: 'completed',
    videoUrl: 'https://youtube.com/',
    docUrl: 'https://docs.google.com/',
    quizCompleted: true,
    tokens: 50,
  },
  {
    title: 'Cryptographic Hashing',
    status: 'completed',
    videoUrl: 'https://youtube.com/',
    docUrl: 'https://docs.google.com/',
    quizCompleted: true,
    tokens: 50,
  },
  {
    title: 'Consensus Mechanisms',
    status: 'completed',
    videoUrl: 'https://youtube.com/',
    docUrl: 'https://docs.google.com/',
    quizCompleted: true,
    tokens: 50,
  },
  {
    title: 'Smart Contracts Basics',
    status: 'available',
    videoUrl: 'https://youtube.com/',
    docUrl: 'https://docs.google.com/',
    quizCompleted: false,
    tokens: 50,
  },
  {
    title: 'Blockchain Applications',
    status: 'locked',
    videoUrl: '',
    docUrl: '',
    quizCompleted: false,
    tokens: 50,
  },
];

const statusLabel = {
  completed: { text: 'Completed', color: 'text-green-600', icon: '✓' },
  available: { text: 'Available', color: 'text-blue-600', icon: '' },
  locked: { text: 'Locked', color: 'text-gray-400', icon: '🔒' },
};

export default function CourseDetails({ course, onBack }) {
  // Add state for watched items
  const [watchedItems, setWatchedItems] = useState({});

  // Handler for marking as watched/read
  const handleMarkAsWatched = (sectionIdx, type) => {
    setWatchedItems(prev => ({ ...prev, [`${sectionIdx}-${type}`]: true }));
  };

  // Helper to check if both video and document are marked
  const canTakeQuiz = (sectionIdx) => {
    return watchedItems[`${sectionIdx}-video`] && watchedItems[`${sectionIdx}-document`];
  };

  if (!course) return null;
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button className="mb-4 text-blue-600" onClick={onBack}>&larr; Back to Dashboard</button>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-3xl font-bold mb-1">{course.title}</h2>
            <div className="text-gray-600 text-base mb-1">Learn the fundamentals of blockchain technology and how it's revolutionizing various industries.</div>
            <div className="text-gray-500 text-sm">Instructor: Alice Johnson</div>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg text-right">
            <div className="font-bold text-lg">{course.tokens || 150} / 250</div>
            <div className="text-xs text-gray-600">Tokens</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">Course Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(course.progress / course.total) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-right text-gray-500 mb-2">
          {course.progress}/{course.total} sections completed
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">Course Sections</h3>
      {allSections.map((section, idx) => (
        <div
          key={idx}
          className={`rounded-lg p-6 mb-6 border flex flex-col gap-2 ${section.status === 'completed' ? 'bg-green-50 border-green-200' : section.status === 'available' ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">{idx + 1}</span>
              <div>
                <div className="font-bold text-xl flex items-center gap-2">{section.title} {statusLabel[section.status].icon && <span className={statusLabel[section.status].color + ' text-lg'}>{statusLabel[section.status].icon}</span>}</div>
                <div className={statusLabel[section.status].color + ' text-sm font-semibold'}>{statusLabel[section.status].text}</div>
              </div>
            </div>
            <div className={`font-semibold text-sm ${section.status === 'completed' ? 'text-green-800' : 'text-gray-700'} text-right`}>
              {section.tokens} tokens {section.status === 'completed' ? 'earned' : 'available'}
            </div>
          </div>
          <div className="flex flex-wrap gap-8 items-start mt-2">
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>▶</span> Video Lesson</div>
              <button
                className="w-full bg-white border px-4 py-2 rounded shadow-sm mb-1 disabled:opacity-50"
                onClick={() => section.videoUrl && window.open(section.videoUrl, '_blank')}
                disabled={section.status === 'locked'}
              >
                Watch Video
              </button>
              {section.status === 'available' && (
                <button
                  className={`w-full text-xs ${watchedItems[`${idx}-video`] ? 'text-gray-400' : 'text-blue-600'}`}
                  onClick={() => handleMarkAsWatched(idx, 'video')}
                  disabled={watchedItems[`${idx}-video`]}
                >
                  {watchedItems[`${idx}-video`] ? '✓ Watched' : 'Mark as Watched'}
                </button>
              )}
            </div>
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>📄</span> Reading Material</div>
              <button
                className="w-full bg-white border px-4 py-2 rounded shadow-sm mb-1 disabled:opacity-50"
                onClick={() => section.docUrl && window.open(section.docUrl, '_blank')}
                disabled={section.status === 'locked'}
              >
                Read Document
              </button>
              {section.status === 'available' && (
                <button
                  className={`w-full text-xs ${watchedItems[`${idx}-document`] ? 'text-gray-400' : 'text-blue-600'}`}
                  onClick={() => handleMarkAsWatched(idx, 'document')}
                  disabled={watchedItems[`${idx}-document`]}
                >
                  {watchedItems[`${idx}-document`] ? '✓ Read' : 'Mark as Read'}
                </button>
              )}
            </div>
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>⚙️</span> Section Quiz</div>
              {section.status === 'locked' ? (
                <button className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed" disabled>Complete materials first</button>
              ) : section.quizCompleted ? (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">✓ Quiz Completed</span>
              ) : (
                <button
                  className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${!canTakeQuiz(idx) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!canTakeQuiz(idx)}
                >
                  {canTakeQuiz(idx) ? 'Take Quiz' : 'Complete materials first'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
