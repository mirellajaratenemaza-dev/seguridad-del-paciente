
import React, { useEffect, useState } from "react";

export default function SimulatorMode({ apiBase, practice }) {
  const [level, setLevel] = useState("basico");
  const [caseData, setCaseData] = useState(null);
  const [selected, setSelected] = useState(-1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practice.id, level]);

  async function loadCase() {
    setLoading(true);
    setResult(null);
    setSelected(-1);
    try {
      const r = await fetch(`${apiBase}/api/sim/case?practice_id=${practice.id}&level=${level}`);
      const data = await r.json();
      setCaseData(data?.error ? null : data);
      if (data?.error) setResult({ error: data.error });
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!caseData || selected < 0) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`${apiBase}/api/sim/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseData.id, selected_index: selected })
      });
      const data = await r.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row">
      <div className="card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{practice.name}</div>
            <div className="small">Modo Simulador</div>
          </div>
          <div style={{ minWidth: 220 }}>
            <div className="small">Nivel</div>
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="hr" />

        {loading && <div className="small">Cargando caso…</div>}

        {!loading && !caseData && !result?.error && (
          <div className="small">No hay caso disponible.</div>
        )}

        {caseData && (
          <>
            <div className="badge">Caso</div>
            <p style={{ lineHeight: 1.5 }}>{caseData.stem}</p>

            <div className="badge">Opciones</div>
            {caseData.options.map((opt, idx) => (
              <label key={idx} className="opt" style={{ display:"block", cursor:"pointer" }}>
                <input
                  type="radio"
                  name="opt"
                  value={idx}
                  checked={selected === idx}
                  onChange={() => setSelected(idx)}
                  style={{ marginRight: 8 }}
                />
                {opt}
              </label>
            ))}

            <div style={{ display:"flex", gap:8, marginTop: 10, flexWrap:"wrap" }}>
              <button className="btn" disabled={loading || selected < 0} onClick={submit}>Enviar</button>
              <button className="btn secondary" disabled={loading} onClick={loadCase}>Otro caso</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 800 }}>Retroalimentación</div>
        <div className="small">Feedback inmediato con enfoque preventivo.</div>
        <div className="hr" />

        {result?.error && <div className="small">{result.error}</div>}

        {!result && !result?.error && (
          <div className="small">Selecciona una opción y envía tu respuesta.</div>
        )}

        {result && !result.error && (
          <>
            <div className="badge">{result.is_correct ? "✅ Correcto" : "❌ Incorrecto"}</div>
            <p style={{ lineHeight: 1.5 }}>{result.feedback}</p>

            <div className="small">
              {result.source_hint ? <span><b>Referencia interna:</b> {result.source_hint}</span> : null}
            </div>

            {!result.is_correct && (
              <div className="small" style={{ marginTop: 8 }}>
                Siguiente paso: vuelve al modo Estudio de esta práctica y formula 1 pregunta al Tutor sobre “cómo prevenir este error”.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
