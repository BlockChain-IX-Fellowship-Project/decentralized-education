// src/utils/getAllCourses.js

/**
 * Fetch all courses from the backend.
 * @returns {Promise<Array>} - Array of course objects
 */
export async function getAllCourses() {
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const res = await fetch(`${BASE_URL}/api/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return await res.json();
}
