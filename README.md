
# SafePatient IA — App (Modo Estudio + Simulador)

Esta app es un MVP para integrarse a tu plataforma (p.ej., LearnWorlds) mediante **iframe**.
Incluye:
- 17 prácticas seguras como menú (según el manual cargado)
- Modo Estudio: microlección + extractos recuperados del manual + tutor (búsqueda TF-IDF)
- Modo Simulador: casos y retroalimentación

## Cómo correr en local (rápido)
1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Abre: http://localhost:5173

## Integración a tu plataforma
- Publica frontend + backend en un hosting (Render, Railway, VPS, etc.).
- En tu lección de LearnWorlds, inserta un iframe:
  - `https://TU-DOMINIO-FRONTEND/`
- (Siguiente paso) Añadir JWT para identificar usuario y enviar progreso.

## Despliegue ultra simple (1 solo servicio)

Esta versión incluye un `Dockerfile` en la raíz que compila el frontend y lo sirve desde el backend.
Así tendrás **una sola URL** para embeber en LearnWorlds.

- En Render/Railway/Fly.io: crea un servicio desde este repo/ZIP usando **Docker**.
- Exponerá `:8000`.
