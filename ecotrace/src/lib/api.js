const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
async function req(path, opts = {}) {
  let res
  try { res = await fetch(BASE + path, opts) }
  catch { throw new Error(`Cannot reach the EcoTrace backend at ${BASE}. Start it and try again.`) }
  if (!res.ok) throw new Error(`Backend error ${res.status}`)
  return res.status === 204 ? null : res.json()
}
const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export const api = {
  health: () => req('/api/health'),
  items: () => req('/api/waste/items'),
  scan: (file) => { const f = new FormData(); f.append('file', file); return req('/api/scan', { method: 'POST', body: f }) },
  confirm: (data) => req('/api/scan/confirm', json('POST', data)),
  history: () => req('/api/history'),
  updateHistory: (id, data) => req(`/api/history/${id}`, json('PATCH', data)),
  deleteHistory: (id) => req(`/api/history/${id}`, { method: 'DELETE' }),
  analytics: () => req('/api/analytics'),
  recommendations: () => req('/api/recommendations'),
  recyclers: (p) => req('/api/recyclers?' + new URLSearchParams(p)),
  carbon: (data) => req('/api/carbon/estimate', json('POST', data)),
  compare: (data) => req('/api/simulator/compare', json('POST', data)),
}
// Temporary offline/demo fallback ONLY. Not a substitute for the backend.
const K = 'ecotrace_demo_history'
export const demoStore = {
  all: () => { try { return JSON.parse(localStorage.getItem(K)) || [] } catch { return [] } },
  save: (a) => localStorage.setItem(K, JSON.stringify(a)),
  add(r) { this.save([{ ...r, id: 'demo-' + Date.now(), date: new Date().toISOString(), quantity: r.quantity || 1 }, ...this.all()]) },
}
