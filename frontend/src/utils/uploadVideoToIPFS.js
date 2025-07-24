// src/utils/uploadVideoToIPFS.js

/**
 * Uploads a video file to the backend and returns the IPFS hash.
 * @param {File} videoFile - The video file to upload.
 * @returns {Promise<string>} - The IPFS hash returned by the backend.
 */
export async function uploadVideoToIPFS(videoFile) {
  const formData = new FormData();
  formData.append('video', videoFile);
const res = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload video');
  const data = await res.json();
  return data.ipfsHash;
}
