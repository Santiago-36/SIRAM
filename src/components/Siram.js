import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000/estudiante";

const styles = `
  .siram-wrap { font-family: Arial, sans-serif; }
  .hdrGreen { background: #2d5016; }
  .footerGray { background: #3a3a3a; }
  .fadeIn { animation: fadeIn 0.5s; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  input[type=text].loginInput, input[type=password].loginInput {
    width:100%; padding:10px 14px; border:1px solid #d1d5db;
    border-radius:8px; font-size:15px; box-sizing:border-box;
  }
  input[type=text].loginInput:focus, input[type=password].loginInput:focus {
    outline:none; box-shadow:0 0 0 2px #16a34a;
  }
  table { border-collapse:collapse; width:100%; }
  th, td { padding:10px 14px; }
  thead th { background:#f3f4f6; font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; text-align:left; }
  tbody tr:hover { background:#f9fafb; }
  tbody tr { border-top:1px solid #e5e7eb; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function Header({ userName, onLogout }) {
  return (
    <header className="hdrGreen" style={{ color:"#fff", boxShadow:"0 4px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <img src="https://www.unisimon.edu.co/recursos/img/medalla2.png" alt="Acreditado" style={{ height:70, width:"auto" }} />
          <img src="https://unisimon.edu.co/english/showimagen/showpdf/universidad-simon-bolivar-9807a.png" alt="Unisimon" style={{ height:70, width:"auto" }} />
        </div>
        <h1 style={{ fontSize:16, fontWeight:"bold", textAlign:"center", flex:1, margin:0 }}>
          SISTEMA DE INFORMACIÓN DE RENDIMIENTO<br />ACADÉMICO MATEMÁTICO - SIRAM
        </h1>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontWeight:600 }}>👤 {userName}</span>
          <button onClick={onLogout} style={{ background:"#dc2626", color:"#fff", border:"none", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontWeight:600 }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footerGray" style={{ color:"#fff", marginTop:48 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:32 }}>
          <div>
            <h3 style={{ fontWeight:"bold", fontSize:16, marginBottom:8 }}>Contacto</h3>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>Email: notificacionesjudicialesbaq@unisimon.edu.co</p>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>PBX: +57 (605) 3185510 | +57 (605) 3444333</p>
          </div>
          <div>
            <h3 style={{ fontWeight:"bold", fontSize:16, marginBottom:8 }}>Servicios</h3>
            {["Monitoreo Académico","Seguimiento Estudiantil","Análisis Estadístico","CAMFI","Asesoría"].map(s => (
              <p key={s} style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>{s}</p>
            ))}
          </div>
          <div>
            <h3 style={{ fontWeight:"bold", fontSize:16, marginBottom:8 }}>Ubicación</h3>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>Barranquilla, Colombia</p>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>Carrera 59 No. 59-65 - Sede principal</p>
          </div>
          <div>
            <h3 style={{ fontWeight:"bold", fontSize:16, marginBottom:8 }}>Universidad Simón Bolívar</h3>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>Excelencia académica</p>
            <p style={{ color:"#d1d5db", fontSize:13, margin:"4px 0" }}>Formación integral</p>
          </div>
        </div>
        <div style={{ borderTop:"1px solid #4b5563", marginTop:24, paddingTop:24, textAlign:"center", color:"#9ca3af", fontSize:13 }}>
          © 2025 Universidad Simón Bolívar - SIRAM. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

function RoleSelection({ onSelect }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#16a34a,#14532d)" }}>
      <div className="fadeIn" style={{ background:"#fff", borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", padding:40, maxWidth:400, width:"100%" }}>
        <h2 style={{ textAlign:"center", fontSize:28, fontWeight:"bold", color:"#1f2937", marginBottom:8 }}>Bienvenido a SIRAM</h2>
        <p style={{ textAlign:"center", color:"#6b7280", marginBottom:32 }}>
          Sistema de Información de Rendimiento<br />Académico Matemático
        </p>
        <p style={{ textAlign:"center", color:"#6b7280", marginBottom:24 }}>Seleccione su tipo de usuario</p>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <button onClick={() => onSelect("profesor")}
            style={{ background:"#15803d", color:"#fff", border:"none", padding:"16px 24px", borderRadius:10, fontSize:16, fontWeight:"bold", cursor:"pointer" }}>
            🎓 Profesor
          </button>
          <button onClick={() => onSelect("estudiante")}
            style={{ background:"#2563eb", color:"#fff", border:"none", padding:"16px 24px", borderRadius:10, fontSize:16, fontWeight:"bold", cursor:"pointer" }}>
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
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#16a34a,#14532d)" }}>
      <div className="fadeIn" style={{ background:"#fff", borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", padding:40, maxWidth:400, width:"100%" }}>
        <h2 style={{ textAlign:"center", fontSize:28, fontWeight:"bold", color:"#1f2937", marginBottom:8 }}>Iniciar Sesión</h2>
        <p style={{ textAlign:"center", color:"#6b7280", marginBottom:32 }}>
          Ingrese como {role === "profesor" ? "Profesor" : "Estudiante"}
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <label style={{ display:"block", fontWeight:600, color:"#374151", marginBottom:6 }}>Usuario</label>
            <input type="text" className="loginInput" value={user} onChange={e => setUser(e.target.value)} />
          </div>
          <div>
            <label style={{ display:"block", fontWeight:600, color:"#374151", marginBottom:6 }}>Contraseña</label>
            <input type="password" className="loginInput" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button onClick={() => user && onLogin(user)}
            style={{ background:"#15803d", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:15, fontWeight:"bold", cursor:"pointer" }}>
            Ingresar
          </button>
          <button onClick={onBack}
            style={{ background:"#6b7280", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:15, fontWeight:"bold", cursor:"pointer" }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:200 }}>
      <div style={{ width:40, height:40, border:"4px solid #d1fae5", borderTop:"4px solid #15803d", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", color:"#991b1b", padding:"12px 16px", borderRadius:8, marginBottom:24 }}>
      ⚠️ Error al conectar con la API: {message}
    </div>
  );
}

function StatCard({ label, value, bg }) {
  return (
    <div style={{ background:bg, borderRadius:12, padding:24, color:"#fff" }}>
      <p style={{ fontSize:13, fontWeight:600, margin:"0 0 8px", opacity:0.85 }}>{label}</p>
      <p style={{ fontSize:32, fontWeight:"bold", margin:0 }}>{value}</p>
    </div>
  );
}

function Badge({ children, bg, color }) {
  return (
    <span style={{ background:bg, color, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
      {children}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { year:"numeric", month:"long", day:"numeric" });
}

/* ─── VISTA PROFESOR ─── */
function ProfesorDashboard({ students, loading, error }) {
  const semestres = [...new Set(students.map(s => s.semestre_actual))].sort((a, b) => a - b);
  const programas  = [...new Set(students.map(s => s.id_programa))];
  const lastEntry  = students.length
    ? students.reduce((a, b) => new Date(a.fecha_ingreso) > new Date(b.fecha_ingreso) ? a : b).fecha_ingreso
    : null;

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px", minHeight:"calc(100vh - 200px)" }}>
      <h2 className="fadeIn" style={{ fontSize:28, fontWeight:"bold", color:"#1f2937", marginBottom:32 }}>
        Panel de Estudiantes
      </h2>

      {error && <ErrorBanner message={error} />}
      {loading ? <Spinner /> : (
        <>
          {/* Métricas */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:32 }}>
            <StatCard label="Total Estudiantes"  value={students.length}    bg="linear-gradient(135deg,#3b82f6,#2563eb)" />
            <StatCard label="Programas"           value={programas.length}   bg="linear-gradient(135deg,#a855f7,#9333ea)" />
            <StatCard label="Semestres Activos"   value={semestres.length}   bg="linear-gradient(135deg,#22c55e,#16a34a)" />
            <StatCard label="Último Ingreso"      value={formatDate(lastEntry)} bg="linear-gradient(135deg,#f59e0b,#d97706)" />
          </div>

          {/* Distribución por semestre */}
          <div style={{ background:"#fff", border:"2px solid #15803d", borderRadius:12, padding:24, marginBottom:32 }}>
            <h3 style={{ fontSize:18, fontWeight:"bold", color:"#1f2937", marginBottom:16 }}>
              Distribución por Semestre
            </h3>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {semestres.map(sem => {
                const count = students.filter(s => s.semestre_actual === sem).length;
                return (
                  <div key={sem} style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"12px 20px", textAlign:"center" }}>
                    <p style={{ fontSize:12, color:"#166534", fontWeight:600, margin:"0 0 4px" }}>Semestre {sem}</p>
                    <p style={{ fontSize:24, fontWeight:"bold", color:"#15803d", margin:0 }}>{count}</p>
                    <p style={{ fontSize:11, color:"#6b7280", margin:"4px 0 0" }}>
                      estudiante{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla */}
          <div className="fadeIn" style={{ background:"#fff", border:"2px solid #15803d", borderRadius:12, overflow:"hidden" }}>
            <div className="hdrGreen" style={{ padding:"16px 24px" }}>
              <h3 style={{ color:"#fff", fontSize:18, fontWeight:"bold", margin:0 }}>Lista de Estudiantes</h3>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>ID Estudiante</th>
                    <th>Código Estudiantil</th>
                    <th>ID Usuario</th>
                    <th>ID Programa</th>
                    <th>Semestre Actual</th>
                    <th>Fecha de Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign:"center", color:"#9ca3af", padding:32 }}>
                        No se encontraron estudiantes
                      </td>
                    </tr>
                  ) : students.map(s => (
                    <tr key={s.id_estudiante}>
                      <td style={{ fontWeight:600 }}>{s.id_estudiante}</td>
                      <td>
                        <Badge bg="#dcfce7" color="#166534">{s.codigo_estudiantil}</Badge>
                      </td>
                      <td>{s.id_usuario}</td>
                      <td>
                        <Badge bg="#ede9fe" color="#5b21b6">Programa {s.id_programa}</Badge>
                      </td>
                      <td>
                        <Badge bg="#dbeafe" color="#1e40af">Semestre {s.semestre_actual}</Badge>
                      </td>
                      <td style={{ color:"#6b7280", fontSize:13 }}>{formatDate(s.fecha_ingreso)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── VISTA ESTUDIANTE ─── */
function EstudianteDashboard({ userName, students, loading, error }) {
  const student = students.find(s => s.codigo_estudiantil === userName);

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px", minHeight:"calc(100vh - 200px)" }}>
      <h2 className="fadeIn" style={{ fontSize:28, fontWeight:"bold", color:"#1f2937", marginBottom:32 }}>
        Mi Información Académica
      </h2>

      {error && <ErrorBanner message={error} />}

      {loading ? <Spinner /> : !student ? (
        <div style={{ background:"#fef3c7", border:"1px solid #fde68a", color:"#92400e", padding:"16px 20px", borderRadius:8 }}>
          No se encontró un estudiante con el código <strong>{userName}</strong> en el sistema.
        </div>
      ) : (
        <div className="fadeIn">
          {/* Ficha detalle */}
          <div style={{ background:"#fff", border:"2px solid #15803d", borderRadius:12, overflow:"hidden", marginBottom:24 }}>
            <div className="hdrGreen" style={{ padding:"16px 24px" }}>
              <h3 style={{ color:"#fff", fontSize:18, fontWeight:"bold", margin:0 }}>Datos del Estudiante</h3>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
                {[
                  { label:"ID Estudiante",       value: student.id_estudiante },
                  { label:"Código Estudiantil",  value: student.codigo_estudiantil },
                  { label:"ID Usuario",          value: student.id_usuario },
                  { label:"ID Programa",         value: student.id_programa },
                  { label:"Semestre Actual",     value: `Semestre ${student.semestre_actual}` },
                  { label:"Fecha de Ingreso",    value: formatDate(student.fecha_ingreso) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background:"#f9fafb", borderRadius:8, padding:"14px 18px", border:"1px solid #e5e7eb" }}>
                    <p style={{ fontSize:11, color:"#6b7280", fontWeight:600, margin:"0 0 4px", textTransform:"uppercase" }}>{label}</p>
                    <p style={{ fontSize:16, fontWeight:"bold", color:"#1f2937", margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards resumen */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            <StatCard label="Semestre Actual" value={student.semestre_actual} bg="linear-gradient(135deg,#22c55e,#16a34a)" />
            <StatCard label="ID Programa"     value={student.id_programa}     bg="linear-gradient(135deg,#a855f7,#9333ea)" />
            <StatCard label="ID Usuario"      value={student.id_usuario}      bg="linear-gradient(135deg,#3b82f6,#2563eb)" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ROOT ─── */
export default function SIRAM() {
  const [page, setPage]         = useState("role-selection");
  const [role, setRole]         = useState(null);
  const [userName, setUserName] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const dashboardPages = ["profesor-dashboard", "student-dashboard"];
    if (!dashboardPages.includes(page)) return;

    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setStudents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  const logout = () => {
    setPage("role-selection");
    setRole(null);
    setUserName("");
    setStudents([]);
    setError(null);
  };

  const showHeader = !["role-selection", "login"].includes(page);

  return (
    <div className="siram-wrap">
      <style>{styles}</style>

      {showHeader && <Header userName={userName} onLogout={logout} />}

      {page === "role-selection" && (
        <RoleSelection onSelect={r => { setRole(r); setPage("login"); }} />
      )}

      {page === "login" && (
        <Login
          role={role}
          onLogin={u => {
            setUserName(u);
            setPage(role === "profesor" ? "profesor-dashboard" : "student-dashboard");
          }}
          onBack={() => setPage("role-selection")}
        />
      )}

      {page === "profesor-dashboard" && (
        <>
          <ProfesorDashboard students={students} loading={loading} error={error} />
          <Footer />
        </>
      )}

      {page === "student-dashboard" && (
        <>
          <EstudianteDashboard userName={userName} students={students} loading={loading} error={error} />
          <Footer />
        </>
      )}
    </div>
  );
}