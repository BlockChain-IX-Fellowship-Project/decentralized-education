import React, { useState } from 'react';

export default function CourseForm({ onBack }) {
  const [sections, setSections] = useState([
    {
      title: '',
      videoFile: null,
      docUrl: '',
    },
  ]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const handleSectionChange = (idx, field, value) => {
    const updated = [...sections];
    updated[idx][field] = value;
    setSections(updated);
  };

  const handleVideoChange = (idx, file) => {
    const updated = [...sections];
    updated[idx].videoFile = file;
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        videoFile: null,
        docUrl: '',
      },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare form data for upload (example, adjust as needed)
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      sections: sections.map(({ title, videoFile, docUrl }) => ({ title, videoFile, docUrl })),
    };
    console.log('Submitting course:', courseData);
    // You may want to use FormData and send to backend here
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
              <div className="flex gap-4 mb-2 items-center">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  type="file"
                  accept="video/*"
                  onChange={e => handleVideoChange(sIdx, e.target.files[0])}
                />
                
              </div>
              {section.videoFile && (
                <div className="text-green-600 text-sm mb-2">Selected: {section.videoFile.name}</div>
              )}
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
