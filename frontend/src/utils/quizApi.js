export async function updateSectionProgress({ userId, courseId, sectionId, score, total }) {
  const res = await fetch('http://localhost:5000/api/quizzes/progress/section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, courseId, sectionId, score, total })
  });
  return res.json();
}

export async function getUserProgress({ userId, courseId }) {
  const res = await fetch(`http://localhost:5000/api/quizzes/progress/user?userId=${userId}&courseId=${courseId}`);
  return res.json();
}