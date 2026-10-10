"""EcoTrace demo backend: honest manual-identification fallback, persistent history."""
from __future__ import annotations
from datetime import datetime, timezone
from collections import Counter
from pathlib import Path
from typing import Optional
import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Integer, String, DateTime, Float, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session

DB_URL = os.getenv("ECOTRACE_DATABASE_URL", "sqlite:///./ecotrace.db")
engine = create_engine(DB_URL, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine)
class Base(DeclarativeBase): pass
class WasteRecord(Base):
    __tablename__ = "waste_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    item: Mapped[str] = mapped_column(String(80), index=True)
    category: Mapped[str] = mapped_column(String(30))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    weight_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
Base.metadata.create_all(engine)

def db_session():
    with SessionLocal() as db:
        yield db

CATALOG = {
    "plastic_bottle": ("dry", False, "Check local acceptance and resin type; empty the bottle before collection.", "Consider a refillable bottle."),
    "coffee_sachet": ("dry", False, "Often multilayer packaging; check specialist collection locally.", "Consider a larger package or refill system."),
    "banana_peel": ("wet", True, "Suitable for many home composting systems; mix with dry leaves.", "Plan portions and compost suitable scraps."),
    "vegetable_scraps": ("wet", True, "Compost in an appropriate home system with dry materials.", "Store food well and use suitable scraps."),
    "paper": ("dry", False, "Keep clean and dry; check local paper collection.", "Use both sides and reuse sheets."),
    "cardboard": ("dry", False, "Flatten clean cardboard for collection.", "Reuse boxes where practical."),
    "metal_can": ("dry", False, "Empty and place in accepted metal recycling collection.", "Choose refillable packaging where practical."),
    "glass_bottle": ("dry", False, "Check local glass collection and separate broken glass safely.", "Use returnable bottles where available."),
    "plastic_wrapper": ("dry", False, "Flexible or multilayer plastics may need special collection.", "Consider products with less packaging."),
    "battery": ("hazardous", False, "Take to an authorised battery collection point; never compost.", "Consider rechargeable batteries where suitable."),
    "electronic_waste": ("e-waste", False, "Use an authorised e-waste collection facility.", "Repair or extend device life where possible."),
    "sanitary_waste": ("sanitary", False, "Wrap and dispose according to local sanitary-waste rules.", "Follow local hygiene and disposal guidance."),
}

app = FastAPI(title="EcoTrace API", version="0.1.0")
origins = [s.strip() for s in os.getenv("ECOTRACE_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if s.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class ConfirmIn(BaseModel):
    item: str
    quantity: int = Field(default=1, ge=1, le=10000)
    weight_kg: Optional[float] = Field(default=None, gt=0, le=100000)
class EditIn(BaseModel):
    item: Optional[str] = None
    quantity: Optional[int] = Field(default=None, ge=1, le=10000)
    weight_kg: Optional[float] = Field(default=None, gt=0, le=100000)
class CarbonIn(BaseModel):
    item: str
    weight_kg: float = Field(gt=0)
    factor_kg_co2e_per_kg: Optional[float] = Field(default=None, ge=0)
    factor_source: Optional[str] = None


def serialize(r: WasteRecord):
    return {"id": r.id, "item": r.item, "category": r.category, "quantity": r.quantity, "weight_kg": r.weight_kg, "created_at": r.created_at.isoformat(), "date": r.created_at.isoformat(), "disposal": CATALOG.get(r.item, (None, None, "", None))[2]}

@app.get("/api/health")
def health(): return {"status": "ok", "service": "EcoTrace Backend"}

@app.get("/api/waste/items")
def waste_items():
    return [{"item": k, "category": v[0], "compostable": v[1], "disposal_guidance": v[2], "alternative": v[3]} for k, v in CATALOG.items()]

@app.post("/api/scan")
async def scan(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image")
    data = await file.read(5_000_001)
    if len(data) > 5_000_000: raise HTTPException(413, "Image must be 5 MB or smaller")
    from PIL import Image, UnidentifiedImageError
    from io import BytesIO
    try:
        with Image.open(BytesIO(data)) as im:
            im.verify()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(400, "Invalid image file")
    from waste_ai import predict_image
    prediction = predict_image(data)
    return {
    "status": "manual_identification_required",
    "class_id": prediction["class_id"],
    "confidence": prediction["confidence"],
    "message": "AI prediction generated. Waste category needs confirmation."
}

@app.post("/api/scan/confirm", status_code=201)
def confirm(payload: ConfirmIn, db: Session = Depends(db_session)):
    if payload.item not in CATALOG: raise HTTPException(422, "Unknown item; choose an item from /api/waste/items")
    r = WasteRecord(item=payload.item, category=CATALOG[payload.item][0], quantity=payload.quantity, weight_kg=payload.weight_kg)
    db.add(r); db.commit(); db.refresh(r)
    return serialize(r)

@app.get("/api/history")
def history(db: Session = Depends(db_session)):
    return [serialize(r) for r in db.scalars(select(WasteRecord).order_by(WasteRecord.id.desc())).all()]

@app.patch("/api/history/{record_id}")
def edit(record_id: int, payload: EditIn, db: Session = Depends(db_session)):
    r = db.get(WasteRecord, record_id)
    if not r: raise HTTPException(404, "Record not found")
    changes = payload.model_dump(exclude_unset=True)
    if "item" in changes:
        if changes["item"] not in CATALOG: raise HTTPException(422, "Unknown item")
        r.category = CATALOG[changes["item"]][0]
    for k, v in changes.items(): setattr(r, k, v)
    db.commit(); db.refresh(r)
    return serialize(r)

@app.delete("/api/history/{record_id}")
def delete(record_id: int, db: Session = Depends(db_session)):
    r = db.get(WasteRecord, record_id)
    if not r: raise HTTPException(404, "Record not found")
    db.delete(r); db.commit()
    return {"deleted": True}

@app.get("/api/analytics")
def analytics(db: Session = Depends(db_session)):
    records = db.scalars(select(WasteRecord)).all()
    by_item = Counter(); by_category = Counter(); by_day = Counter()
    for r in records:
        by_item[r.item] += r.quantity
        by_category[r.category] += r.quantity
        by_day[r.created_at.date().isoformat()] += r.quantity
    return {"total_records": len(records), "total_items": sum(r.quantity for r in records), "by_item": dict(by_item), "by_category": dict(by_category), "by_day": dict(sorted(by_day.items())), "most_frequent_items": [k for k, _ in by_item.most_common(5)]}

@app.get("/api/recommendations")
def recommendations(db: Session = Depends(db_session)):
    counts = Counter()
    for r in db.scalars(select(WasteRecord)).all(): counts[r.item] += r.quantity
    return [{"item": item, "recorded_quantity": count, "recommendation": CATALOG[item][3], "reason": f"You recorded {count} of this item."} for item, count in counts.most_common() if count >= 2]

@app.get("/api/compost/items")
def compost_items():
    return [{"item": k, "guidance": v[2]} for k, v in CATALOG.items() if v[1]]

@app.get("/api/recyclers")
def recyclers(city: Optional[str] = None, material: Optional[str] = None):
    return {"items": [], "message": "No verified recycler directory is connected yet. Please check authorised local collection sources.", "city": city, "material": material}

@app.post("/api/carbon/estimate")
def carbon_estimate(payload: CarbonIn):
    if payload.factor_kg_co2e_per_kg is None or not payload.factor_source:
        return {"status": "insufficient_data", "message": "Supply a documented emission factor and source for a defensible estimate."}
    return {"status": "estimated", "item": payload.item, "kg_co2e": round(payload.weight_kg * payload.factor_kg_co2e_per_kg, 5), "formula": "weight_kg × factor_kg_co2e_per_kg", "factor_source": payload.factor_source, "note": "Scenario estimate only; not a full product lifecycle or personal footprint."}

@app.post("/api/simulator/compare")
def simulator():
    return {"status": "insufficient_data", "message": "Scenario comparison requires validated alternative-specific assumptions and emission factors."}

@app.post("/api/scan/multiple")
def scan_multiple():
    return {"status": "not_implemented", "message": "Multi-object recognition requires a compatible detection model."}
