export const API_BASE_URL = 'http://localhost:3000';

export async function fetchDrivers() {
  const response = await fetch(`${API_BASE_URL}/admin/drivers`);
  if (!response.ok) throw new Error('Failed to fetch drivers');
  return response.json();
}

export async function fetchPendingDrivers() {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/pending`);
  if (!response.ok) throw new Error('Failed to fetch pending drivers');
  return response.json();
}

export async function approveDriver(id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/drivers/${id}/approve`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to approve driver');
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/admin/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}
