# EcoTrace (frontend)
Scan Smart. Waste Less. Live Greener.

## Windows + VS Code setup
```
cd ecotrace
npm install
npm run dev
```
Open http://localhost:5173. Requires Node 18+.

## Connect the backend
`.env` holds `VITE_API_BASE_URL=http://localhost:8000`. Restart `npm run dev` after editing it.
Expected endpoints: POST /api/scan (multipart `file`), POST /api/scan/confirm, GET /api/history, PATCH|DELETE /api/history/{id},
GET /api/analytics, GET /api/recommendations, GET /api/recyclers, POST /api/carbon/estimate, POST /api/simulator/compare, GET /api/health.
Scan response fields used: id, item, material, category, recyclability, compostable, instructions, confidence.
Without a backend, scans show a connection error. History falls back to labelled browser-only demo storage.
Multi-object scanning is marked Coming Soon.
