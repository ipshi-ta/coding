# EcoTrace — combined frontend + backend

The React frontend from your upload and the FastAPI backend are in one ZIP. The frontend design was preserved.

## Start backend (Windows PowerShell in VS Code)

Open a terminal inside `ecotrace_backend` and run:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Test http://localhost:8000/api/health and http://localhost:8000/docs

## Start frontend (second terminal)

Open a terminal inside `ecotrace` and run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173

## Demo

1. Scan Waste > Upload Image > Analyse.
2. Select the photographed item manually (automatic AI image recognition is not integrated).
3. Save to History.
4. Check History, Dashboard, and Alternatives. The SQLite database persists history.

## Limitations

Automatic AI waste recognition and multi-object detection are NOT implemented. Recycler results are empty until a verified directory is connected. Carbon estimates require reliable emission factors and weights. Camera access requires localhost or HTTPS.

Do not claim these features are complete during the hackathon.
