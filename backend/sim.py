
import json
from pathlib import Path
from typing import Dict, Any, Optional, List
import random

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

class SimBank:
    def __init__(self):
        with open(DATA_DIR / "sim_cases.json", "r", encoding="utf-8") as f:
            self.cases: List[Dict[str, Any]] = json.load(f)
        self.by_id = {c["id"]: c for c in self.cases}

    def random_case(self, practice_id: str, level: str) -> Optional[Dict[str, Any]]:
        candidates = [c for c in self.cases if c["practice_id"] == practice_id and c["level"] == level]
        if not candidates:
            # si no hay del nivel, devuelve cualquiera de la práctica
            candidates = [c for c in self.cases if c["practice_id"] == practice_id]
        if not candidates:
            return None
        return random.choice(candidates)

    def grade(self, case_id: str, selected_index: int) -> Dict[str, Any]:
        case = self.by_id.get(case_id)
        if not case:
            return {"error": "case_id no encontrado"}
        correct = case["correct_index"]
        is_correct = int(selected_index) == int(correct)

        feedback = case["feedback_correct"] if is_correct else case["feedback_incorrect"][selected_index if 0 <= selected_index < len(case["feedback_incorrect"]) else 0]
        return {
            "case_id": case_id,
            "is_correct": is_correct,
            "correct_index": correct,
            "feedback": feedback,
            "source_hint": case.get("source_hint","")
        }
