export const API_BASE_URL = 'http://localhost:3000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
}

export async function fetchDrivers() {
  const response = await fetch(`${API_BASE_URL}/admin/drivers`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch drivers');
  return response.json();
}

export async function fetchPendingDrivers() {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/pending`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch pending drivers');
  return response.json();
}

export async function approveDriver(id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/${id}/approve`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to approve driver');
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}
