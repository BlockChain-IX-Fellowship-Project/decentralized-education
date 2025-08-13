const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function updateSectionProgress({ userId, courseId, sectionId, score, total }) {
  const res = await fetch(`${BASE_URL}/api/quizzes/progress/section`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, courseId, sectionId, score, total })
  });
  return res.json();
}

export async function getUserProgress({ userId, courseId }) {
  const res = await fetch(`${BASE_URL}/api/quizzes/progress/user?userId=${userId}&courseId=${courseId}`);
  return res.json();
}