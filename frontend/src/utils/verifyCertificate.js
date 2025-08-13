// src/utils/verifyCertificate.js

/**
 * Verify a certificate on-chain via backend API.
 * @param {string} walletAddress - The user's wallet address
 * @param {string} courseId - The course ID
 * @returns {Promise<{ipfsHash: string, valid: boolean}>}
 */
const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function verifyCertificate(walletAddress, courseId) {
  const res = await fetch(`${BASE_URL}/api/certificates/verify?walletAddress=${walletAddress}&courseId=${courseId}`);
  if (!res.ok) throw new Error('Verification failed');
  return await res.json();
}
