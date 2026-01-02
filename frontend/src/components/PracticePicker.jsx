
import React from "react";

export default function PracticePicker({ practices, value, onChange }) {
  return (
    <div className="row">
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Práctica segura</div>
        <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
          {practices.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.category}
            </option>
          ))}
        </select>
        <div className="small" style={{ marginTop: 8 }}>
          Consejo: empieza por <b>Identificación</b>, <b>Higiene de manos</b>, <b>Cirugía segura</b> y <b>Notificación</b>.
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Cómo usar la app</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li><b>Estudio:</b> microlección + extractos del manual + preguntas al tutor.</li>
          <li><b>Simulador:</b> casos con opciones y retroalimentación inmediata.</li>
        </ul>
      </div>
    </div>
  );
}
