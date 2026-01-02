
import React, { useEffect, useState } from "react";

export default function StudyMode({ apiBase, practice }) {
  const [level, setLevel] = useState("basico");
  const [lesson, setLesson] = useState(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLesson(null);
    setChat(null);
    setQuestion("");
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practice.id, level]);

  async function loadLesson() {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/study/lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practice_id: practice.id, level })
      });
      const data = await r.json();
      setLesson(data.lesson);
    } finally {
      setLoading(false);
    }
  }

  async function askTutor() {
    if (!question.trim()) return;
    setLoading(true);
    setChat(null);
    try {
      const r = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practice_id: practice.id, question })
      });
      const data = await r.json();
      setChat(data);
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
            <div className="small">Modo Estudio</div>
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

        {loading && !lesson && <div className="small">Cargando microlección…</div>}

        {lesson && (
          <>
            <div className="badge">Microlección</div>
            <p style={{ lineHeight: 1.5 }}>{lesson.microleccion}</p>

            <div className="badge">Extractos (manual)</div>
            {lesson.excerpts.map((e, idx) => (
              <div key={idx} className="opt">
                <div className="small">Pág. {e.page_start}{e.page_end !== e.page_start ? `–${e.page_end}` : ""}</div>
                <div style={{ whiteSpace:"pre-wrap" }}>{e.excerpt}</div>
              </div>
            ))}

            <div className="small" style={{ marginTop: 8 }}>{lesson.study_tip}</div>
          </>
        )}
      </div>

      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 800 }}>Pregúntale al Tutor IA</div>
        <div className="small">Responde usando fragmentos recuperados del manual cargado.</div>
        <div className="hr" />

        <textarea
          className="input"
          rows="4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta (ej.: ¿cuáles son los errores frecuentes y cómo prevenirlos?)"
        />
        <div style={{ display:"flex", gap:8, marginTop: 10 }}>
          <button className="btn" disabled={loading} onClick={askTutor}>Preguntar</button>
          <button className="btn secondary" disabled={loading} onClick={() => { setQuestion(""); setChat(null); }}>Limpiar</button>
        </div>

        {loading && <div className="small" style={{ marginTop: 10 }}>Procesando…</div>}

        {chat && (
          <div style={{ marginTop: 12 }}>
            <div className="badge">Respuesta</div>
            <p style={{ lineHeight: 1.5 }}>{chat.answer}</p>

            <div className="badge">Citas</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {chat.citations.map((c, idx) => (
                <li key={idx} className="small">
                  Pág. {c.page_start}{c.page_end !== c.page_start ? `–${c.page_end}` : ""} (chunk {c.chunk_id})
                </li>
              ))}
            </ul>

            <div className="small" style={{ marginTop: 8 }}>{chat.note}</div>
          </div>
        )}
      </div>
    </div>
  );
}
