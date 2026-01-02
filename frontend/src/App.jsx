
import React, { useEffect, useMemo, useState } from "react";
import PracticePicker from "./components/PracticePicker.jsx";
import StudyMode from "./components/StudyMode.jsx";
import SimulatorMode from "./components/SimulatorMode.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function App() {
  const [practices, setPractices] = useState([]);
  const [practiceId, setPracticeId] = useState("");
  const [mode, setMode] = useState("study"); // study | sim

  useEffect(() => {
    fetch(`${API_BASE}/api/practices`)
      .then(r => r.json())
      .then(data => {
        setPractices(data);
        if (data?.length) setPracticeId(data[0].id);
      })
      .catch(() => setPractices([]));
  }, []);

  const currentPractice = useMemo(
    () => practices.find(p => p.id === practiceId),
    [practices, practiceId]
  );

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>SafePatient IA</div>
            <div className="small">Modo Estudio + Simulador (basado en el manual cargado)</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className={`btn ${mode==="study" ? "" : "secondary"}`} onClick={() => setMode("study")}>Estudio</button>
            <button className={`btn ${mode==="sim" ? "" : "secondary"}`} onClick={() => setMode("sim")}>Simulador</button>
          </div>
        </div>
        <div className="hr" />
        <PracticePicker
          practices={practices}
          value={practiceId}
          onChange={setPracticeId}
        />
      </div>

      {mode === "study" && currentPractice && (
        <StudyMode apiBase={API_BASE} practice={currentPractice} />
      )}

      {mode === "sim" && currentPractice && (
        <SimulatorMode apiBase={API_BASE} practice={currentPractice} />
      )}

      <div className="small" style={{ marginTop: 14 }}>
        Tip integración: puedes embeber esta app en tu plataforma con un <span className="kbd">iframe</span> y usar un token (JWT) para identificar al usuario.
      </div>
    </div>
  );
}
