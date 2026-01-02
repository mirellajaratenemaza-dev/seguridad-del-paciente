
import json
import os
from pathlib import Path
from typing import List, Dict, Any, Tuple
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

def _clean(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    return s

class ManualStore:
    """
    Carga el manual (en chunks) y permite búsqueda semántica simple (TF-IDF).
    Esto funciona sin servicios externos. Si luego quieres un LLM, lo conectas
    manteniendo esta recuperación como base (RAG).
    """
    def __init__(self):
        self.chunks = self._load_json(DATA_DIR / "manual_chunks.json")
        self.practices = self._load_json(DATA_DIR / "practices.json")

        self._texts = [_clean(c["text"]) for c in self.chunks]
        self._vectorizer = TfidfVectorizer(stop_words=None, max_features=50000)
        self._matrix = self._vectorizer.fit_transform(self._texts)

    @staticmethod
    def _load_json(path: Path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def find_practice(self, practice_id: str) -> Dict[str, Any]:
        for p in self.practices:
            if p["id"] == practice_id:
                return p
        raise ValueError("practice_id no encontrado")

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        q = _clean(query)
        qv = self._vectorizer.transform([q])
        sims = cosine_similarity(qv, self._matrix)[0]
        idxs = sims.argsort()[::-1][:top_k]
        results = []
        for i in idxs:
            c = self.chunks[int(i)]
            results.append({
                "chunk_id": c["chunk_id"],
                "page_start": c["page_start"],
                "page_end": c["page_end"],
                "score": float(sims[int(i)]),
                "text": c["text"]
            })
        return results
