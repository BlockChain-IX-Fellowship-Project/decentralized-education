import React, { useState } from 'react';
import { uploadVideoToIPFS } from '../utils/uploadVideoToIPFS';
import { createFullCourse } from '../utils/createFullCourse';

// Helper to extract a thumbnail from a video file
async function extractVideoThumbnail(file, seekTo = 1.0) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.currentTime = seekTo;
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg');
    };
    video.onerror = reject;
  });
}

export default function CourseForm({ onBack }) {
  const [sections, setSections] = useState([
    {
      title: '',
      videoFile: null,
      docUrl: '',
      thumbnail: null, // Add thumbnail to section state
    },
  ]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState(null); // Store course-level thumbnail
  const [instructor, setInstructor] = useState("");
  const [instructorBio, setInstructorBio] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);
  const [requirements, setRequirements] = useState([""]);

  const handleSectionChange = (idx, field, value) => {
    const updated = [...sections];
    updated[idx][field] = value;
    setSections(updated);
  };

  const handleVideoChange = async (idx, file) => {
    const updated = [...sections];
    updated[idx].videoFile = file;
    // Extract thumbnail for this video
    if (file) {
      const thumbBlob = await extractVideoThumbnail(file, 1.0);
      updated[idx].thumbnail = thumbBlob;
      // For now, use the first section's thumbnail as the course image
      if (idx === 0) setCourseThumbnail(thumbBlob);
    }
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

  const handleAddWhatYouWillLearn = () => setWhatYouWillLearn([...whatYouWillLearn, ""]);
  const handleChangeWhatYouWillLearn = (idx, value) => {
    const updated = [...whatYouWillLearn];
    updated[idx] = value;
    setWhatYouWillLearn(updated);
  };
  const handleRemoveWhatYouWillLearn = (idx) => {
    if (whatYouWillLearn.length === 1) return;
    setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== idx));
  };

  const handleAddRequirement = () => setRequirements([...requirements, ""]);
  const handleChangeRequirement = (idx, value) => {
    const updated = [...requirements];
    updated[idx] = value;
    setRequirements(updated);
  };
  const handleRemoveRequirement = (idx) => {
    if (requirements.length === 1) return;
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ipfsSections = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      let ipfsHash = '';
      if (section.videoFile) {
        ipfsHash = await uploadVideoToIPFS(section.videoFile);
      }
      ipfsSections.push({
        title: section.title,
        docUrl: section.docUrl,
        ipfsHash,
      });
    }
    let imageDataUrl = '';
    if (courseThumbnail) {
      imageDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(courseThumbnail);
      });
    }
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      instructor,
      instructorBio,
      level,
      whatYouWillLearn: whatYouWillLearn.filter(Boolean),
      requirements: requirements.filter(Boolean),
      sections: ipfsSections,
      image: imageDataUrl,
    };
    try {
      const data = await createFullCourse(courseData);
      setLoading(false);
      onBack();
    } catch (err) {
      setLoading(false);
      console.error('Error creating course:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button className="mb-4 text-blue-600" onClick={onBack}>&larr; Back to Dashboard</button>
      <h2 className="text-3xl font-bold mb-6">Create New Course</h2>
      <form onSubmit={handleSubmit} className={loading ? 'pointer-events-none opacity-60' : ''}>
        {loading && (
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-600 font-semibold">Uploading videos and creating course, please wait...</span>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Course Title</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Enter course title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Course Description</label>
            <textarea className="w-full border rounded px-3 py-2" placeholder="Describe what students will learn" value={courseDescription} onChange={e => setCourseDescription(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Instructor Name</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Enter instructor name" value={instructor} onChange={e => setInstructor(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Instructor Detail / About</label>
            <textarea className="w-full border rounded px-3 py-2" placeholder="Enter instructor bio or about" value={instructorBio} onChange={e => setInstructorBio(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Level</label>
            <select className="w-full border rounded px-3 py-2" value={level} onChange={e => setLevel(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">What You Will Learn</label>
            {whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Learning outcome"
                  value={item}
                  onChange={e => handleChangeWhatYouWillLearn(idx, e.target.value)}
                />
                <button type="button" className="bg-red-100 text-red-700 px-2 rounded" onClick={() => handleRemoveWhatYouWillLearn(idx)} disabled={whatYouWillLearn.length === 1}>Remove</button>
              </div>
            ))}
            <button type="button" className="bg-blue-100 text-blue-700 px-3 py-1 rounded" onClick={handleAddWhatYouWillLearn}>+ Add</button>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Requirements</label>
            {requirements.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Requirement"
                  value={item}
                  onChange={e => handleChangeRequirement(idx, e.target.value)}
                />
                <button type="button" className="bg-red-100 text-red-700 px-2 rounded" onClick={() => handleRemoveRequirement(idx)} disabled={requirements.length === 1}>Remove</button>
              </div>
            ))}
            <button type="button" className="bg-blue-100 text-blue-700 px-3 py-1 rounded" onClick={handleAddRequirement}>+ Add</button>
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
                {section.thumbnail && (
                  <img
                    src={URL.createObjectURL(section.thumbnail)}
                    alt="Video thumbnail"
                    className="w-24 h-16 object-cover rounded border"
                  />
                )}
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
