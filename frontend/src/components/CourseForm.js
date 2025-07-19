import React, { useState } from 'react';

export default function CourseForm({ onBack }) {
  const [sections, setSections] = useState([
    {
      title: '',
      videoUrl: '',
      docUrl: '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          answer: 0,
        },
      ],
    },
  ]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const handleSectionChange = (idx, field, value) => {
    const updated = [...sections];
    updated[idx][field] = value;
    setSections(updated);
  };

  const handleQuestionChange = (sIdx, qIdx, field, value) => {
    const updated = [...sections];
    updated[sIdx].questions[qIdx][field] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        videoUrl: '',
        docUrl: '',
        questions: [
          { question: '', options: ['', '', '', ''], answer: 0 },
        ],
      },
    ]);
  };

  const addQuestion = (sIdx) => {
    const updated = [...sections];
    updated[sIdx].questions.push({ question: '', options: ['', '', '', ''], answer: 0 });
    setSections(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedSections = sections.map(section => ({
      ...section,
      questions: section.questions.map(q => ({
        ...q,
        correctAnswer: q.options[q.answer]
      }))
    }));
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      sections: preparedSections
    };
    console.log('Submitting course:', courseData);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button className="mb-4 text-blue-600" onClick={onBack}>&larr; Back to Dashboard</button>
      <h2 className="text-3xl font-bold mb-6">Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Course Title</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Enter course title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Course Description</label>
            <textarea className="w-full border rounded px-3 py-2" placeholder="Describe what students will learn" value={courseDescription} onChange={e => setCourseDescription(e.target.value)} />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4">Course Sections</h3>
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="font-bold text-lg mb-2">Section {sIdx + 1}</div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Enter section title"
                value={section.title}
                onChange={e => handleSectionChange(sIdx, 'title', e.target.value)}
              />
              <div className="flex gap-4 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="https://youtube.com/watch?v=..."
                  value={section.videoUrl}
                  onChange={e => handleSectionChange(sIdx, 'videoUrl', e.target.value)}
                />
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="https://docs.google.com/..."
                  value={section.docUrl}
                  onChange={e => handleSectionChange(sIdx, 'docUrl', e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Quiz Questions</div>
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="mb-4">
                  <input
                    className="w-full border rounded px-3 py-2 mb-2"
                    placeholder={`Enter your question`}
                    value={q.question}
                    onChange={e => handleQuestionChange(sIdx, qIdx, 'question', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center">
                        <input
                          type="radio"
                          name={`answer-${sIdx}-${qIdx}`}
                          checked={q.answer === oIdx}
                          onChange={() => handleQuestionChange(sIdx, qIdx, 'answer', oIdx)}
                          className="mr-2"
                        />
                        <input
                          className="border rounded px-2 py-1 flex-1"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={e => {
                            const updated = [...sections];
                            updated[sIdx].questions[qIdx].options[oIdx] = e.target.value;
                            setSections(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded mr-2"
                onClick={() => addQuestion(sIdx)}
                type="button"
              >
                + Add Question
              </button>
            </div>
          </div>
        ))}
        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded mr-2" onClick={addSection} type="button">
          + Add Section
        </button>
        <button type="submit" className="bg-black text-white px-6 py-2 rounded float-right mt-6 mb-10">Submit Course</button>
      </form>
    </div>
  );
}
