// src/utils/getAllCourses.js

/**
 * Fetch all courses from the backend.
 * @returns {Promise<Array>} - Array of course objects
 */
export async function getAllCourses() {
  const res = await fetch('http://localhost:5000/api/courses');
  if (!res.ok) throw new Error('Failed to fetch courses');
  return await res.json();
}
