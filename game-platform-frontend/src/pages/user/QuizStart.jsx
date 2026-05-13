import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";


export default function QuizStart() {
  const navigate = useNavigate();

  const levels = [
    { name: "EASY",      count: 10, color: "#22c55e", glow: "rgba(34,197,94,0.12)",  label: "Warm up your neural link" },
    { name: "MEDIUM",    count: 10, color: "#f59e0b", glow: "rgba(245,158,11,0.12)", label: "Push your cognitive limits" },
    { name: "HARD",      count: 15, color: "#ef4444", glow: "rgba(239,68,68,0.12)",  label: "Only the strong survive" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#e8e8e0", textAlign: "center", padding: "60px 20px 80px", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .quiz-start::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,75,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,75,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .qs-header { margin-bottom:48px; position: relative; z-index: 5; }
        .qs-sub { font-family:'Share Tech Mono', monospace; font-size:10px; letter-spacing:3px; color:rgba(232,232,224,0.5); text-transform:uppercase; margin:0 0 8px; }
        .qs-title { font-family:'Orbitron', monospace; font-size:32px; font-weight:900; color:#7eb8d4; margin:0; letter-spacing:4px; text-shadow:0 0 30px rgba(126,184,212,0.4); }
        .qs-title span { color: #d4a84b; }
        .qs-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; max-width:800px; margin:0 auto; position: relative; z-index: 5; }
        .qs-card { background:rgba(8,10,14,0.85); border:1px solid rgba(126,184,212,0.2); border-radius:12px; padding:32px 24px; cursor:pointer; transition:all 0.3s ease; display:flex; flex-direction:column; align-items:center; gap:12px; position:relative; overflow:hidden; backdrop-filter: blur(10px); }
        .qs-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, #7eb8d4, transparent); opacity:0; transition:opacity 0.3s; }
        .qs-card:hover { transform:translateY(-6px); border-color:rgba(126,184,212,0.4); box-shadow:0 0 40px rgba(126,184,212,0.15); }
        .qs-card:hover::before { opacity:0.6; }
        .qs-badge { font-family:'Orbitron', monospace; font-size:11px; letter-spacing:3px; padding:4px 12px; border-radius:6px; font-weight: 700; }
        .qs-name { font-family:'Orbitron', monospace; font-size:22px; font-weight:900; margin:0; letter-spacing:4px; }
        .qs-count { font-family:'Share Tech Mono', monospace; font-size:10px; letter-spacing:2px; color:rgba(232,232,224,0.5); margin:0; }
        .qs-label { font-family:'Rajdhani', sans-serif; font-size:13px; color:rgba(232,232,224,0.6); margin:0; }
        .qs-play { margin-top:6px; padding:10px 28px; border-radius:6px; font-family:'Orbitron', monospace; font-size:10px; letter-spacing:3px; font-weight:700; text-transform:uppercase; transition:all 0.2s; }
        .qs-play:hover { box-shadow:0 0 20px rgba(126,184,212,0.3); }
        .qs-footer { margin-top:40px; font-family:'Share Tech Mono', monospace; font-size:10px; color:rgba(232,232,224,0.5); letter-spacing:2px; position: relative; z-index: 5; }
      `}</style>

      <div className="quiz-start" style={{ position: 'relative', zIndex: 5 }}>
        <div className="qs-header">
          <p className="qs-sub">Select Difficulty Level</p>
          <h1 className="qs-title">QUIZ <span>PROTOCOLS</span></h1>
        </div>

        <div className="qs-grid">
          {levels.map((lv) => (
            <div key={lv.name} className="qs-card" onClick={() => navigate(`/quiz/play/${lv.name}`)}>
              <div className="qs-badge" style={{ background: lv.glow, color: lv.color, border: `1px solid ${lv.color}40` }}>{lv.name}</div>
              <h2 className="qs-name" style={{ color: lv.color, textShadow: `0 0 20px ${lv.glow}` }}>{lv.name}</h2>
              <p className="qs-count">{lv.count} QUESTIONS</p>
              <p className="qs-label">{lv.label}</p>
              <div className="qs-play" style={{ background: lv.glow, color: lv.color, border: `1px solid ${lv.color}55` }}>INITIATE //</div>
            </div>
          ))}
        </div>

        <p className="qs-footer">ONE WRONG ANSWER = TERMINATION</p>
      </div>
    </div>
  );
}