
# -------- Build frontend --------
FROM node:18-alpine AS fe
WORKDIR /fe
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
# Build
RUN npm run build

# -------- Backend runtime --------
FROM python:3.11-slim AS be
WORKDIR /app

# Install backend deps
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app
COPY backend/ ./backend/

# Copy built frontend into backend/static
RUN mkdir -p /app/backend/static
COPY --from=fe /fe/dist/ /app/backend/static/

EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
