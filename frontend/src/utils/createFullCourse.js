// src/utils/createFullCourse.js

/**
 * Sends a request to create a full course (with sections and videos) to the backend.
 * @param {Object} courseData - The course data object (title, description, createdBy, sections[])
 * @returns {Promise<Object>} - The created course data from the backend
 */
export async function createFullCourse(courseData) {
  const res = await fetch('http://localhost:5000/api/courses/full', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error('Failed to create course');
  return await res.json();
}
