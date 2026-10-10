# EcoTrace Backend

A lightweight, working FastAPI + SQLite backend for the EcoTrace hackathon website. It does **not** claim to have automatic AI waste recognition or a verified recycler directory. Uploaded images are validated and the user is prompted to choose an item manually.

## Run in Windows VS Code (Python 3.11 or 3.12 recommended)

```powershell
cd ecotrace_backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

If Python 3.12 isn't installed, use `py -3.11` instead. Open http://localhost:8000/docs for interactive API documentation, or http://localhost:8000/api/health to test.

The frontend can call `http://localhost:8000/api/...`. By default CORS allows localhost:5173. For other origins set `ECOTRACE_CORS_ORIGINS` to comma-separated trusted origins. SQLite is stored in `ecotrace.db` in the current working directory.

## Core flow

1. `POST /api/scan` with multipart form field `file` for a photo. It validates the image and returns `manual_identification_required` until an actual vision model is integrated.
2. `GET /api/waste/items` to populate the manual item picker.
3. `POST /api/scan/confirm` with JSON such as `{ "item": "plastic_bottle", "quantity": 1 }`.
4. `GET /api/history`, `GET /api/analytics`, `GET /api/recommendations` to see saved data.

This is a hackathon prototype, not a production multi-user service: it uses one shared local database, no authentication, and no automatic AI image identification. Carbon calculations require a user-supplied, sourced factor and weight; recycler search is a clearly labelled placeholder. Do not deploy publicly without authentication, rate limits, and privacy controls.
