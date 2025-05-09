// Utility functions for backend API communication
export const API_BASE = 'http://localhost:8000';

export async function fetchGrid() {
  const res = await fetch(`${API_BASE}/grid`);
  return res.json();
}

export async function setCell(x: number, y: number, value: number) {
  await fetch(`${API_BASE}/grid/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y, value })
  });
}

export async function stepGrid() {
  const res = await fetch(`${API_BASE}/grid/step`, { method: 'POST' });
  return res.json();
}

export async function resetGrid() {
  await fetch(`${API_BASE}/grid/reset`, { method: 'POST' });
}

export async function setGridSize(n: number) {
  await fetch(`${API_BASE}/grid/size/${n}`, { method: 'POST' });
}

export async function setSeed(mode: string) {
  await fetch(`${API_BASE}/grid/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}

export async function fetchThresholds() {
  const res = await fetch(`${API_BASE}/grid/thresholds`);
  return res.json();
}

export async function setThresholds(pos_threshold: number, neg_threshold: number) {
  const res = await fetch(`${API_BASE}/grid/thresholds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pos_threshold, neg_threshold })
  });
  return res.json();
}

export async function exportPattern() {
  const res = await fetch(`${API_BASE}/grid/export`);
  return res.json();
}

export async function importPattern(state: any) {
  const res = await fetch(`${API_BASE}/grid/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
  return res.json();
}
