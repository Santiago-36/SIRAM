import { useState, useEffect, useRef } from "react";

const initialStudents = [
  { id: 1, nombre: "Ahumada De la Hoz Nicolle Alexa", codigo: "2021115001", curso: "4035-T05", corte1: 4.2, obs1: "", corte2: 4.5, obs2: "", corte3: 4.3, obs3: "" },
  { id: 2, nombre: "Becerra Pereira Paula Andrea", codigo: "2021115002", curso: "4035-T05", corte1: 3.8, obs1: "", corte2: 3.9, obs2: "", corte3: 4.0, obs3: "" },
  { id: 3, nombre: "Caicedo Zabaleta Lizeth Carolina", codigo: "2021115003", curso: "4035-T04", corte1: 4.5, obs1: "", corte2: 4.7, obs2: "", corte3: 4.8, obs3: "" },
  { id: 4, nombre: "Cantillo Bastidas Santiago", codigo: "2021115004", curso: "4035-T04", corte1: 2.5, obs1: "", corte2: 2.6, obs2: "", corte3: 2.7, obs3: "" },
  { id: 5, nombre: "Diaz Garrido Miller Daniel", codigo: "2021115005", curso: "4035-T02", corte1: 4.0, obs1: "", corte2: 4.1, obs2: "", corte3: 4.2, obs3: "" },
  { id: 6, nombre: "Molina Cáceres Andrés Felipe", codigo: "2021115006", curso: "4035-T02", corte1: 3.2, obs1: "", corte2: 3.4, obs2: "", corte3: 3.6, obs3: "" },
  { id: 7, nombre: "Porto Ojeda Killian David", codigo: "2021115007", curso: "4035-T05", corte1: 4.6, obs1: "", corte2: 4.5, obs2: "", corte3: 4.7, obs3: "" },
  { id: 8, nombre: "Tejera Gutierrez Jesús David", codigo: "2021115008", curso: "4035-T02", corte1: 2.8, obs1: "", corte2: 2.9, obs2: "", corte3: 2.7, obs3: "" },
];

const courseData = {
  "4035-T05": { examDate: "25 de Octubre", examTopic: "Derivadas e integrales", quicesCompleted: 6, quicesTotal: 8, quicesNext: "22 de Octubre", exercisesBank: 150 },
  "4035-T04": { examDate: "26 de Octubre", examTopic: "Límites y continuidad", quicesCompleted: 5, quicesTotal: 8, quicesNext: "23 de Octubre", exercisesBank: 120 },
  "4035-T02": { examDate: "27 de Octubre", examTopic: "Funciones", quicesCompleted: 7, quicesTotal: 8, quicesNext: "24 de Octubre", exercisesBank: 180 },
};

const courses = [
  { id: 1, name: "Cálculo Diferencial", code: "4035-T05" },
  { id: 2, name: "Cálculo Diferencial", code: "4035-T04" },
  { id: 3, name: "Cálculo Diferencial", code: "4035-T02" },
];

function calcWeightedAvg(s) {
  return s.corte1 * 0.3 + s.corte2 * 0.3 + s.corte3 * 0.4;
}

function gradeClass(g) {
  if (g <= 2.9) return "gradeRed";
  if (g <= 3.9) return "gradeYellow";
  return "gradeGreen";
}

function avgClass(a) {
  if (a <= 2.9) return "gradeRed";
  if (a < 4.0) return "gradeYellow";
  return "gradeGreen";
}

function obsFromGrade(g) {
  if (g <= 2.9) return "Va mal, requiere seguimiento urgente";
  if (g <= 3.9) return "Rendimiento medio, estar pendiente";
  return "Va muy bien, excelente desempeño";
}

function categorize(students, courseCode) {
  const list = courseCode ? students.filter((s) => s.curso === courseCode) : students;
  const low = [], medium = [], high = [], needsTracking = [];
  list.forEach((s) => {
    const a = calcWeightedAvg(s);
    if (a <= 2.9) { low.push(s); needsTracking.push(s); }
    else if (a <= 3.9) { medium.push(s); needsTracking.push(s); }
    else high.push(s);
  });
  return { low, medium, high, needsTracking };
}

const styles = `
  .siram-wrap { font-family: Arial, sans-serif; }
  .gradeRed { background:#fee2e2; color:#991b1b; font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block; }
  .gradeYellow { background:#fef3c7; color:#92400e; font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block; }
  .gradeGreen { background:#d1fae5; color:#065f46; font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block; }
  .hdrGreen { background:#2d5016; }
  .footerGray { background:#3a3a3a; }
  .fadeIn { animation: fadeIn 0.5s; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .cardHover:hover { transform:scale(1.05); box-shadow:0 10px 25px rgba(0,0,0,0.2); }
  .boxHover:hover { box-shadow:0 10px 25px rgba(0,0,0,0.3); }
  input[type=number] { width:64px; padding:2px 6px; border:1px solid #d1d5db; border-radius:4px; text-align:center; }
  input[type=text].obsInput { width:140px; padding:2px 6px; border:1px solid #d1d5db; border-radius:4px; font-size:12px; }
  input[type=text].loginInput, input[type=password].loginInput { width:100%; padding:10px 14px; border:1px solid #d1d5db; border-radius:8px; font-size:15px; box-sizing:border-box; }
  input[type=text].loginInput:focus, input[type=password].loginInput:focus { outline:none; box-shadow:0 0 0 2px #16a34a; }
  table { border-collapse:collapse; width:100%; }
  th, td { padding:8px 12px; }
  thead th { background:#f3f4f6; font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; text-align:left; }
  tbody tr:hover { background:#f9fafb; }
  tbody tr { border-top:1px solid #e5e7eb; }
`;

function Header({ userName, onLogout }) {
  return (
    <header className="hdrGreen" style={{ color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img src="https://www.unisimon.edu.co/recursos/img/medalla2.png" alt="Acreditado" style={{ height: 70, width: "auto" }} />
          <img src="https://unisimon.edu.co/english/showimagen/showpdf/universidad-simon-bolivar-9807a.png" alt="Unisimon" style={{ height: 70, width: "auto" }} />
        </div>
        <h1 style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", flex: 1, margin: 0 }}>
          SISTEMA DE INFORMACIÓN DE RENDIMIENTO<br />ACADÉMICO MATEMÁTICO - SIRAM
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 600 }}>👤 {userName}</span>
          <button onClick={onLogout} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footerGray" style={{ color: "#fff", marginTop: 48 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          <div>
            <h3 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Contacto</h3>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Email: notificacionesjudicialesbaq@unisimon.edu.co</p>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>PBX: +57 (605) 3185510 | +57 (605) 3444333</p>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Servicios</h3>
            {["Monitoreo Académico","Seguimiento Estudiantil","Análisis Estadístico","CAMFI","Asesoría"].map(s => (
              <p key={s} style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>{s}</p>
            ))}
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Ubicación</h3>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Barranquilla, Colombia</p>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Carrera 59 No. 59-65 - Sede principal</p>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Universidad Simón Bolívar</h3>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Excelencia académica</p>
            <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Formación integral</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #4b5563", marginTop: 24, paddingTop: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
          © 2025 Universidad Simón Bolívar - SIRAM. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

function RoleSelection({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#16a34a,#14532d)" }}>
      <div className="fadeIn" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: 40, maxWidth: 400, width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 8 }}>Bienvenido a SIRAM</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 32 }}>Sistema de Información de Rendimiento<br />Académico Matemático</p>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 24 }}>Seleccione su tipo de usuario</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={() => onSelect("profesor")} style={{ background: "#15803d", color: "#fff", border: "none", padding: "16px 24px", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={e => e.target.style.background="#14532d"} onMouseLeave={e => e.target.style.background="#15803d"}>
            🎓 Profesor
          </button>
          <button onClick={() => onSelect("estudiante")} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "16px 24px", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}
            onMouseEnter={e => e.target.style.background="#1d4ed8"} onMouseLeave={e => e.target.style.background="#2563eb"}>
            👤 Estudiante
          </button>
        </div>
      </div>
    </div>
  );
}

function Login({ role, onLogin, onBack }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#16a34a,#14532d)" }}>
      <div className="fadeIn" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: 40, maxWidth: 400, width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 8 }}>Iniciar Sesión</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 32 }}>Ingrese como {role === "profesor" ? "Profesor" : "Estudiante"}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Usuario</label>
            <input type="text" className="loginInput" value={user} onChange={e => setUser(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Contraseña</label>
            <input type="password" className="loginInput" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button onClick={() => user && onLogin(user)} style={{ background: "#15803d", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
            Ingresar
          </button>
          <button onClick={onBack} style={{ background: "#6b7280", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentCourseInput({ onSubmit }) {
  const [studentCode, setStudentCode] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const handleSubmit = () => {
    const courseExists = courses.find(c => c.code === courseCode);
    if (!courseExists) { alert("Código de curso no válido."); return; }
    const student = initialStudents.find(s => s.codigo === studentCode);
    if (!student) { alert("Código estudiantil no encontrado."); return; }
    if (student.curso !== courseCode) { alert("El estudiante no está matriculado en ese curso."); return; }
    onSubmit(studentCode, courseCode);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#16a34a,#14532d)" }}>
      <div className="fadeIn" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: 40, maxWidth: 400, width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: "bold", color: "#1f2937", marginBottom: 8 }}>Información del Estudiante</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 32 }}>Por favor, ingrese sus datos</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Código Estudiantil</label>
            <input type="text" className="loginInput" placeholder="Ejemplo: 2021115001" value={studentCode} onChange={e => setStudentCode(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 6 }}>Código del Curso</label>
            <input type="text" className="loginInput" placeholder="Ejemplo: 4035-T05" value={courseCode} onChange={e => setCourseCode(e.target.value)} />
          </div>
          <button onClick={handleSubmit} style={{ background: "#15803d", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

function CoursesPage({ students, onSelect }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", minHeight: "calc(100vh - 200px)" }}>
      <h2 className="fadeIn" style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 32 }}>Mis Cursos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
        {courses.map(course => {
          const count = students.filter(s => s.curso === course.code).length;
          return (
            <div key={course.id} className="cardHover fadeIn" onClick={() => onSelect(course.id)}
              style={{ background: "#fff", border: "2px solid #15803d", borderRadius: 12, padding: 24, cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>🎓</div>
              <h3 style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 6 }}>{course.name}</h3>
              <p style={{ color: "#4b5563", fontWeight: 600, marginBottom: 12 }}>{course.code}</p>
              <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 14px", borderRadius: 20, fontSize: 13 }}>{count} estudiantes</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChart({ data, labels, colors }) {
  const max = Math.max(...data, 5);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, padding: "8px 0" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          <span style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{typeof v === "number" ? v.toFixed(1) : v}</span>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: `${(v / max) * 100}%`, background: colors[i % colors.length], borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.4s" }} />
          </div>
          <span style={{ fontSize: 11, color: "#6b7280", marginTop: 4, textAlign: "center" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, labels }) {
  const w = 360, h = 160, pad = 30;
  const max = 5, min = 0;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / (max - min)) * (h - 2 * pad);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const fillPts = [...pts, [pts[pts.length - 1][0], h - pad], [pts[0][0], h - pad]];
  const fill = fillPts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ") + " Z";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      <path d={fill} fill="rgba(34,197,94,0.1)" />
      <path d={d} fill="none" stroke="rgb(34,197,94)" strokeWidth={2} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="rgb(34,197,94)" />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={pts[i][0]} y={h - 6} textAnchor="middle" fontSize={11} fill="#6b7280">{l}</text>
      ))}
      {[0, 2.5, 5].map(v => {
        const y = h - pad - ((v - min) / (max - min)) * (h - 2 * pad);
        return <text key={v} x={pad - 4} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{v}</text>;
      })}
    </svg>
  );
}

function Dashboard({ courseCode, students }) {
  const [expandedBox, setExpandedBox] = useState(null);
  const cats = categorize(students, courseCode);
  const list = students.filter(s => s.curso === courseCode);
  const avgCourse = list.reduce((s, x) => s + calcWeightedAvg(x), 0) / list.length;
  const passed = list.filter(s => calcWeightedAvg(s) >= 3.0).length;
  const failed = list.filter(s => calcWeightedAvg(s) < 3.0).length;
  const info = courseData[courseCode] || {};

  const corte1Avg = list.reduce((s, x) => s + x.corte1, 0) / list.length;
  const corte2Avg = list.reduce((s, x) => s + x.corte2, 0) / list.length;
  const corte3Avg = list.reduce((s, x) => s + x.corte3, 0) / list.length;

  const distRanges = [
    list.filter(s => calcWeightedAvg(s) <= 2.9).length,
    list.filter(s => { const a = calcWeightedAvg(s); return a >= 3.0 && a <= 3.9; }).length,
    list.filter(s => calcWeightedAvg(s) >= 4.0).length,
  ];

  const toggle = (n) => setExpandedBox(prev => prev === n ? null : n);

  const MetBox = ({ name, count, items, bg, key2 }) => (
    <div onClick={() => toggle(key2)} className="boxHover"
      style={{ background: bg, borderRadius: 12, padding: 24, color: "#fff", cursor: "pointer", transition: "box-shadow 0.3s" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{name}</h4>
      <p style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>{count}</p>
      {expandedBox === key2 && items.length > 0 && (
        <div style={{ marginTop: 12, background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: 10, fontSize: 12, maxHeight: 200, overflowY: "auto" }}>
          {items.map(s => <p key={s.id} style={{ margin: "2px 0" }}>• {s.nombre} ({calcWeightedAvg(s).toFixed(2)})</p>)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "2px solid #15803d", borderRadius: 12, padding: 24, marginBottom: 32 }}>
      <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", marginBottom: 24 }}>Dashboard Académico</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        <MetBox name="Estudiantes con Seguimiento" count={cats.needsTracking.length} items={cats.needsTracking} bg="linear-gradient(135deg,#f97316,#ea580c)" key2="tracking" />
        <MetBox name="Bajo Rendimiento" count={cats.low.length} items={cats.low} bg="linear-gradient(135deg,#ef4444,#dc2626)" key2="low" />
        <MetBox name="Rendimiento Medio" count={cats.medium.length} items={cats.medium} bg="linear-gradient(135deg,#f59e0b,#d97706)" key2="medium" />
        <MetBox name="Alto Rendimiento" count={cats.high.length} items={cats.high} bg="linear-gradient(135deg,#22c55e,#16a34a)" key2="high" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        <MetBox name="Aprobados" count={passed} items={list.filter(s => calcWeightedAvg(s) >= 3.0)} bg="linear-gradient(135deg,#14b8a6,#0d9488)" key2="passed" />
        <MetBox name="Reprobados" count={failed} items={list.filter(s => calcWeightedAvg(s) < 3.0)} bg="linear-gradient(135deg,#ec4899,#db2777)" key2="failed" />
        <div style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)", borderRadius: 12, padding: 24, color: "#fff" }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Promedio General</h4>
          <p style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>{avgCourse.toFixed(2)}</p>
        </div>
        <div style={{ background: "linear-gradient(135deg,#a855f7,#9333ea)", borderRadius: 12, padding: 24, color: "#fff" }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Tasa Éxito</h4>
          <p style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>{((passed / list.length) * 100).toFixed(0)}%</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: 20, border: "1px solid #e5e7eb" }}>
          <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#1f2937", marginBottom: 12 }}>Progreso por Cortes</h4>
          <LineChart data={[corte1Avg, corte2Avg, corte3Avg]} labels={["Corte 1", "Corte 2", "Corte 3"]} />
        </div>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: 20, border: "1px solid #e5e7eb" }}>
          <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#1f2937", marginBottom: 12 }}>Distribución de Notas</h4>
          <BarChart data={distRanges} labels={["0–2.9 (Bajo)", "3.0–3.9 (Medio)", "4.0–5.0 (Alto)"]} colors={["rgba(239,68,68,0.8)", "rgba(251,191,36,0.8)", "rgba(34,197,94,0.8)"]} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        <div style={{ background: "#eff6ff", borderLeft: "4px solid #2563eb", borderRadius: 8, padding: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#1e40af", marginBottom: 8 }}>📝 Exámenes</h4>
          <p style={{ color: "#374151", marginBottom: 4 }}>Próximo: {info.examDate}</p>
          <p style={{ color: "#6b7280", fontSize: 13 }}>{info.examTopic}</p>
        </div>
        <div style={{ background: "#f0fdf4", borderLeft: "4px solid #16a34a", borderRadius: 8, padding: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#166534", marginBottom: 8 }}>✏️ Quices</h4>
          <p style={{ color: "#374151", marginBottom: 4 }}>Realizados: {info.quicesCompleted}/{info.quicesTotal}</p>
          <p style={{ color: "#6b7280", fontSize: 13 }}>Próximo: {info.quicesNext}</p>
        </div>
        <div style={{ background: "#faf5ff", borderLeft: "4px solid #9333ea", borderRadius: 8, padding: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#6b21a8", marginBottom: 8 }}>📚 Ejercicios</h4>
          <p style={{ color: "#374151", marginBottom: 4 }}>Banco: {info.exercisesBank} ejercicios</p>
          <p style={{ color: "#6b7280", fontSize: 13 }}>Temas variados disponibles</p>
        </div>
      </div>
    </div>
  );
}

function CourseDetail({ courseId, students, setStudents, onBack }) {
  const course = courses.find(c => c.id === courseId);
  const list = students.filter(s => s.curso === course.code);

  const updateGrade = (id, field, val) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: parseFloat(val) } : s));
  };
  const updateObs = (id, field, val) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={onBack} style={{ background: "#6b7280", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginBottom: 24 }}>
        ← Volver a Cursos
      </button>
      <h2 className="fadeIn" style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>{course.name}</h2>
      <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 32 }}>{course.code}</p>

      <div className="fadeIn" style={{ background: "#fff", border: "2px solid #15803d", borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <div className="hdrGreen" style={{ padding: "16px 24px" }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>Lista de Estudiantes</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Código</th>
                <th>1er Corte</th><th>Observaciones</th>
                <th>2do Corte</th><th>Observaciones</th>
                <th>3er Corte</th><th>Observaciones</th>
                <th>Promedio Ponderado</th>
              </tr>
            </thead>
            <tbody>
              {list.map(student => {
                const avg = calcWeightedAvg(student);
                return (
                  <tr key={student.id}>
                    <td style={{ fontSize: 12 }}>{student.nombre}</td>
                    <td style={{ fontSize: 12 }}>{student.codigo}</td>
                    {["corte1", "corte2", "corte3"].map((corte, ci) => [
                      <td key={`g${ci}`}>
                        <input type="number" step="0.1" min="0" max="5"
                          defaultValue={student[corte]}
                          onBlur={e => updateGrade(student.id, corte, e.target.value)}
                          className={gradeClass(student[corte])}
                          style={{ width: 64, padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: 4, textAlign: "center", fontWeight: "bold" }}
                        />
                      </td>,
                      <td key={`o${ci}`}>
                        <input type="text" className="obsInput"
                          defaultValue={student[`obs${ci + 1}`] || obsFromGrade(student[corte])}
                          onBlur={e => updateObs(student.id, `obs${ci + 1}`, e.target.value)}
                        />
                      </td>
                    ])}
                    <td>
                      <span className={avgClass(avg)} style={{ padding: "4px 10px" }}>{avg.toFixed(2)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Dashboard courseCode={course.code} students={students} />
    </div>
  );
}

function StudentDashboard({ userName, students }) {
  const student = students.find(s => s.codigo === userName);
  if (!student) return <div style={{ padding: 40, color: "#dc2626" }}>No se encontró información del estudiante.</div>;

  const course = courses.find(c => c.code === student.curso);
  const avg = calcWeightedAvg(student);
  const info = courseData[student.curso];

  const performanceLow = [], performanceMedium = [], performanceHigh = [];
  [["1er Corte", student.corte1], ["2do Corte", student.corte2], ["3er Corte", student.corte3]].forEach(([label, nota]) => {
    if (nota <= 2.9) performanceLow.push({ label, nota });
    else if (nota <= 3.9) performanceMedium.push({ label, nota });
    else performanceHigh.push({ label, nota });
  });

  const gradeColors = [student.corte1, student.corte2, student.corte3].map(v =>
    v <= 2.9 ? "rgba(239,68,68,0.8)" : v <= 3.9 ? "rgba(251,191,36,0.8)" : "rgba(34,197,94,0.8)"
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h2 className="fadeIn" style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>Mi Información Académica</h2>
      <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 32 }}>{course.name} - {course.code}</p>

      <div className="fadeIn" style={{ background: "#fff", border: "2px solid #15803d", borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <div className="hdrGreen" style={{ padding: "16px 24px" }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>Mis Calificaciones</h3>
        </div>
        <div style={{ overflowX: "auto", padding: 24 }}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Código</th><th>Curso</th>
                <th>1er Corte</th><th>2do Corte</th><th>3er Corte</th><th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{student.nombre}</td>
                <td style={{ fontSize: 13 }}>{student.codigo}</td>
                <td style={{ fontSize: 13 }}>{student.curso}</td>
                {[student.corte1, student.corte2, student.corte3].map((v, i) => (
                  <td key={i}><span className={gradeClass(v)}>{v.toFixed(1)}</span></td>
                ))}
                <td><span className={avgClass(avg)}>{avg.toFixed(2)}</span></td>
              </tr>
              <tr style={{ background: "#f9fafb" }}>
                <td colSpan={7} style={{ padding: "12px 16px" }}>
                  <p style={{ fontWeight: "bold", color: "#374151", marginBottom: 6, fontSize: 13 }}>Observaciones:</p>
                  {[["1er", student.corte1, student.obs1], ["2do", student.corte2, student.obs2], ["3er", student.corte3, student.obs3]].map(([c, g, o]) => (
                    <p key={c} style={{ color: "#6b7280", fontSize: 13, margin: "2px 0" }}><strong>{c} Corte:</strong> {o || obsFromGrade(g)}</p>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="fadeIn" style={{ background: "#fff", border: "2px solid #15803d", borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", marginBottom: 24 }}>Mi Dashboard Personal</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ background: "#f9fafb", borderRadius: 8, padding: 20, border: "1px solid #e5e7eb" }}>
            <h4 style={{ fontSize: 15, fontWeight: "bold", marginBottom: 12 }}>Mis Notas por Corte</h4>
            <BarChart data={[student.corte1, student.corte2, student.corte3]} labels={["1er Corte", "2do Corte", "3er Corte"]} colors={gradeColors} />
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 8, padding: 20, border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h4 style={{ fontSize: 15, fontWeight: "bold", marginBottom: 16 }}>Promedio General</h4>
            <span className={avgClass(avg)} style={{ fontSize: 48, padding: "16px 32px", borderRadius: 12 }}>{avg.toFixed(2)}</span>
            <p style={{ color: "#6b7280", marginTop: 16, fontSize: 16 }}>{avg >= 3.0 ? "¡Aprobado! 🎉" : "Necesitas mejorar 📚"}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "⚠️ Bajo Rendimiento", items: performanceLow, bg: "linear-gradient(135deg,#ef4444,#dc2626)" },
            { label: "📊 Rendimiento Medio", items: performanceMedium, bg: "linear-gradient(135deg,#f59e0b,#d97706)" },
            { label: "🌟 Alto Rendimiento", items: performanceHigh, bg: "linear-gradient(135deg,#22c55e,#16a34a)" },
          ].map(({ label, items, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 12, padding: 24, color: "#fff" }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{label}</h4>
              <p style={{ fontSize: 36, fontWeight: "bold", margin: "0 0 8px" }}>{items.length}</p>
              {items.length > 0 ? (
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: 10, fontSize: 12 }}>
                  {items.map(p => <p key={p.label} style={{ margin: "2px 0" }}>• {p.label}: {p.nota.toFixed(1)}</p>)}
                </div>
              ) : <p style={{ fontSize: 12 }}>¡Ningún corte en esta categoría!</p>}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          <div style={{ background: "#eff6ff", borderLeft: "4px solid #2563eb", borderRadius: 8, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#1e40af", marginBottom: 8 }}>📝 Videos guías y tutoriales</h4>
            <p style={{ color: "#374151", marginBottom: 4 }}>Próximo: {info.examDate}</p>
            <p style={{ color: "#6b7280", fontSize: 13 }}>{info.examTopic}</p>
          </div>
          <div style={{ background: "#f0fdf4", borderLeft: "4px solid #16a34a", borderRadius: 8, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#166534", marginBottom: 8 }}>✏️ Herramientas interactivas</h4>
            <p style={{ color: "#374151", marginBottom: 4 }}>Realizados: {info.quicesCompleted}/{info.quicesTotal}</p>
            <p style={{ color: "#6b7280", fontSize: 13 }}>Próximo: {info.quicesNext}</p>
          </div>
          <div style={{ background: "#faf5ff", borderLeft: "4px solid #9333ea", borderRadius: 8, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: "bold", color: "#6b21a8", marginBottom: 8 }}>📚 Ejercicios</h4>
            <p style={{ color: "#374151", marginBottom: 4 }}>Banco: {info.exercisesBank} ejercicios</p>
            <p style={{ color: "#6b7280", fontSize: 13 }}>Temas variados disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SIRAM() {
  const [page, setPage] = useState("role-selection");
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState(initialStudents);

  const logout = () => {
    setPage("role-selection"); setRole(null); setUserName(""); setSelectedCourse(null);
  };

  const showHeader = !["role-selection", "login", "student-course-input"].includes(page);

  return (
    <div className="siram-wrap">
      <style>{styles}</style>
      {showHeader && <Header userName={userName} onLogout={logout} />}
      {page === "role-selection" && (
        <RoleSelection onSelect={r => { setRole(r); setPage("login"); }} />
      )}
      {page === "login" && (
        <Login role={role} onLogin={u => { setUserName(u); setPage(role === "estudiante" ? "student-course-input" : "courses"); }} onBack={() => setPage("role-selection")} />
      )}
      {page === "student-course-input" && (
        <StudentCourseInput onSubmit={(code) => { setUserName(code); setPage("student-dashboard"); }} />
      )}
      {page === "courses" && (
        <>
          <CoursesPage students={students} onSelect={id => { setSelectedCourse(id); setPage("course-detail"); }} />
          <Footer />
        </>
      )}
      {page === "course-detail" && (
        <>
          <CourseDetail courseId={selectedCourse} students={students} setStudents={setStudents} onBack={() => setPage("courses")} />
          <Footer />
        </>
      )}
      {page === "student-dashboard" && (
        <>
          <StudentDashboard userName={userName} students={students} />
          <Footer />
        </>
      )}
    </div>
  );
}