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

export async function registerDriver(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/drivers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let msg = 'Failed to register driver';
    try {
      const body = await response.json();
      msg = body.error || body.message || msg;
    } catch {}
    throw new Error(msg);
  }
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
  if (!response.ok) {
    let msg = 'Failed to approve driver';
    try {
      const body = await response.json();
      msg = body.error || body.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return response.json();
}

export async function disableDriver(id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/${id}/disable`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    let msg = 'Failed to disable driver';
    try {
      const body = await response.json();
      msg = body.error || body.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return response.json();
}

export async function rejectDriver(id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    let msg = 'Failed to reject driver';
    try {
      const body = await response.json();
      msg = body.error || body.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return response.json();
}

export async function flushDatabase() {
  const response = await fetch(`${API_BASE_URL}/admin/flush`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to flush database');
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}
