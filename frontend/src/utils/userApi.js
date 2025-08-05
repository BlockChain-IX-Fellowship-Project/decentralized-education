// Utility functions for user API calls

const BASE_URL = "http://localhost:5000";

export async function getUserByWallet(walletAddress) {
  const res = await fetch(`${BASE_URL}/api/users/${walletAddress}`);
  if (!res.ok) throw new Error('User not found');
  return await res.json();
}

export async function createOrUpdateUser({ walletAddress, name, email }) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, name, email })
  });
  if (!res.ok) throw new Error('Failed to save user');
  return await res.json();
}

export async function enrollCertificate({ learnerName, walletAddress, courseId }) {
  const res = await fetch(`${BASE_URL}/api/certificates/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ learnerName, walletAddress, courseId })
  });
  return await res.json();
}

export async function getCertificate({ walletAddress, courseId }) {
  const res = await fetch(`${BASE_URL}/api/certificates/user?walletAddress=${walletAddress}&courseId=${courseId}`);
  return await res.json();
}
