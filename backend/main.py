
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import random

from manual_store import ManualStore
from tutor import build_lesson, answer_question
from sim import SimBank

app = FastAPI(title="SafePatient IA API", version="0.1.0")

# Si existe el frontend compilado, lo servimos desde el mismo backend (1 solo despliegue).
from pathlib import Path
FRONTEND_DIST = Path(__file__).resolve().parent / "static"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/")
    def serve_index():
        idx = FRONTEND_DIST / "index.html"
        return FileResponse(str(idx))

    # Fallback SPA: cualquier ruta no-API devuelve index.html
    @app.get("/{full_path:path}")
    def spa_fallback(full_path: str):
        if full_path.startswith("api/"):
            return {"detail": "Not Found"}
        idx = FRONTEND_DIST / "index.html"
        return FileResponse(str(idx))

# CORS: en producción limita a tu dominio de LearnWorlds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = ManualStore()
sim_bank = SimBank()

class StudyRequest(BaseModel):
    practice_id: str
    level: Optional[str] = "basico"

class ChatRequest(BaseModel):
    practice_id: str
    question: str

class GradeRequest(BaseModel):
    case_id: str
    selected_index: int

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/practices")
def get_practices():
    return store.practices

@app.post("/api/study/lesson")
def study_lesson(req: StudyRequest):
    lesson = build_lesson(store, req.practice_id, req.level or "basico")
    return lesson

@app.post("/api/chat")
def chat(req: ChatRequest):
    return answer_question(store, req.practice_id, req.question)

@app.get("/api/sim/case")
def get_case(practice_id: str, level: str = "basico"):
    case = sim_bank.random_case(practice_id, level)
    if not case:
        return {"error": "No hay casos para esta práctica/nivel todavía."}
    # Oculta respuesta correcta
    safe_case = {k:v for k,v in case.items() if k not in ["correct_index"]}
    return safe_case

@app.post("/api/sim/grade")
def grade(req: GradeRequest):
    result = sim_bank.grade(req.case_id, req.selected_index)
    return result
