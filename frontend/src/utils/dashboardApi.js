function resolveBaseUrl() {
  const fromEnv = process.env.REACT_APP_BASE_URL;
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) return fromEnv;
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return window.location.origin;
  }
  return 'http://localhost:5000';
}

const BASE_URL = resolveBaseUrl();

export async function getDashboardSummary(userId) {
  const res = await fetch(`${BASE_URL}/api/dashboard/summary?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to load dashboard summary');
  return res.json();
}


