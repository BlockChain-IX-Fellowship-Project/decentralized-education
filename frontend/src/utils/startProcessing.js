// src/utils/startProcessing.js
const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function startProcessing({ ipfsHash, sectionTitle, videoId }) {
  const res = await fetch(`${BASE_URL}/api/courses/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ipfsHash, sectionTitle, videoId })
  });
  if (!res.ok) throw new Error('Failed to start processing');
  return await res.json();
}

export async function getProcessingStatus(processId) {
  const res = await fetch(`${BASE_URL}/api/courses/process/${processId}/status`);
  if (!res.ok) throw new Error('Failed to get processing status');
  return await res.json();
}
