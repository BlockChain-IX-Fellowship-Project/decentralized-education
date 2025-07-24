import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const statusLabel = {
  completed: { text: 'Completed', color: 'text-green-600', icon: '✓' },
  available: { text: 'Available', color: 'text-blue-600', icon: '' },
  locked: { text: 'Locked', color: 'text-gray-400', icon: '🔒' },
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedItems, setWatchedItems] = useState({});

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setCourse(null);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  const handleMarkAsWatched = (sectionIdx, type) => {
    setWatchedItems(prev => ({ ...prev, [`${sectionIdx}-${type}`]: true }));
  };

  const canTakeQuiz = (sectionIdx) => {
    return watchedItems[`${sectionIdx}-video`] && watchedItems[`${sectionIdx}-document`];
  };

  if (loading) return <div className="text-blue-600 font-semibold">Loading course details...</div>;
  if (!course) return <div className="text-red-600">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button className="mb-4 text-blue-600" onClick={() => navigate('/dashboard')}>&larr; Back to Dashboard</button>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-3xl font-bold mb-1">{course.title}</h2>
            <div className="text-gray-600 text-base mb-1">{course.description}</div>
            <div className="text-gray-500 text-sm">Instructor: {course.createdBy || 'Unknown'}</div>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg text-right">
            <div className="font-bold text-lg">{course.tokens || 0}</div>
            <div className="text-xs text-gray-600">Tokens</div>
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">Course Sections</h3>
      {course.sections && course.sections.length > 0 ? course.sections.map((section, idx) => {
        const isLocked = idx > 0 && !watchedItems[`${idx - 1}-video`];
        const isCompleted = watchedItems[`${idx}-video`];
        return (
          <div
            key={section._id || idx}
            className={`rounded-lg p-6 mb-6 border flex flex-col gap-2 bg-white border-blue-200 ${isLocked ? 'opacity-60' : ''}`}
            style={isLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}}
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">{idx + 1}</span>
              <div>
                <div className="font-bold text-xl flex items-center gap-2">{section.title}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 items-start mt-2">
              <div className="flex flex-col items-start w-56">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>▶</span> Video Lesson</div>
                {section.videos && section.videos.length > 0 ? section.videos.map((video, vIdx) => (
                  <div style={{ pointerEvents: 'auto', opacity: 1, width: '100%' }} key={video._id || vIdx}>
                    <video
                      controls
                      width="220"
                      className="mb-2 rounded border"
                     src={`https://ipfs.io/ipfs/${video.ipfsHash}`}
                    />
                  </div>
                )) : <div className="text-gray-400 text-xs">No video</div>}
                <button
                  className="w-full text-xs text-blue-600"
                  onClick={() => handleMarkAsWatched(idx, 'video')}
                  disabled={watchedItems[`${idx}-video`] || isLocked}
                >
                  {watchedItems[`${idx}-video`] ? '✓ Watched' : 'Mark as Watched'}
                </button>
              </div>
              <div className="flex flex-col items-start w-56">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>⚙️</span> Section Quiz</div>
                <button
                  className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${!watchedItems[`${idx}-video`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!watchedItems[`${idx}-video`] || isLocked}
                >
                  {watchedItems[`${idx}-video`] ? 'Take Quiz' : 'Complete video first'}
                </button>
              </div>
            </div>
          </div>
        );
      }) : <div className="text-gray-500">No sections found.</div>}
    </div>
  );
}
