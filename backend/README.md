
# SafePatient IA (Backend)

## Requisitos
- Python 3.10+

## Instalación
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecutar
```bash
uvicorn main:app --reload --port 8000
```

Endpoints principales:
- GET  /api/practices
- POST /api/study/lesson   { practice_id, level }
- POST /api/chat          { practice_id, question }
- GET  /api/sim/case?practice_id=...&level=...
- POST /api/sim/grade     { case_id, selected_index }
