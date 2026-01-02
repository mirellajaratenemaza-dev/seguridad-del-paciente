
from typing import Dict, Any, List
import re

def _extractive_summary(text: str, max_sentences: int = 4) -> str:
    # Resumen muy simple por selección de frases "densas"
    sents = re.split(r'(?<=[.!?])\s+', text.strip())
    sents = [s for s in sents if len(s.split()) >= 8]
    if not sents:
        return text[:400] + ("..." if len(text) > 400 else "")
    # Heurística: frases con más palabras "de acción"
    action_words = {"debe","deben","verificar","confirmar","realizar","registrar","notificar","asegurar","prevenir","controlar","identificar"}
    scored = []
    for s in sents:
        words = set(w.strip(".,;:()[]").lower() for w in s.split())
        score = sum(1 for w in words if w in action_words) + len(s)/200
        scored.append((score, s))
    scored.sort(reverse=True, key=lambda x:x[0])
    chosen = [s for _,s in scored[:max_sentences]]
    return " ".join(chosen)

def build_lesson(store, practice_id: str, level: str = "basico") -> Dict[str, Any]:
    p = store.find_practice(practice_id)
    query = f"{p['name']} " + " ".join(p.get("keywords", []))
    hits = store.search(query, top_k=6)

    # Construye microlección basada en extractos del manual
    combined = " ".join(h["text"] for h in hits[:3])
    summary = _extractive_summary(combined, max_sentences=5)

    key_excerpts = []
    for h in hits[:3]:
        excerpt = h["text"]
        if len(excerpt) > 700:
            excerpt = excerpt[:700] + "..."
        key_excerpts.append({
            "page_start": h["page_start"],
            "page_end": h["page_end"],
            "excerpt": excerpt
        })

    return {
        "practice": p,
        "level": level,
        "lesson": {
            "microleccion": summary,
            "excerpts": key_excerpts,
            "study_tip": "Tip: intenta explicar la práctica con tus propias palabras y luego aplícala en un caso breve."
        }
    }

def answer_question(store, practice_id: str, question: str) -> Dict[str, Any]:
    p = store.find_practice(practice_id)
    query = f"{p['name']} {question}"
    hits = store.search(query, top_k=5)

    # Respuesta "IA" sin LLM: apoya en extractos + resumen
    combined = " ".join(h["text"] for h in hits[:2])
    answer = _extractive_summary(combined, max_sentences=6)

    citations = [{"page_start": h["page_start"], "page_end": h["page_end"], "chunk_id": h["chunk_id"]} for h in hits[:3]]

    return {
        "practice": p,
        "question": question,
        "answer": answer,
        "citations": citations,
        "note": "Respuesta generada a partir de fragmentos recuperados del manual cargado en la app."
    }
