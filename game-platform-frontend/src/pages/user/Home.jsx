import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const GAMES = [
  { icon: "◎", label: "QUIZ", color: "#d4a84b", desc: "Test your knowledge across categories" },
  { icon: "▣", label: "ARCADE", color: "#dc505a", desc: "Snake & Tetris fast-paced challenges" },
  { icon: "◈", label: "CHESS", color: "#7eb8d4", desc: "Strategic mind vs. mind combat" },
  { icon: "◇", label: "MEMORY", color: "#6aac7a", desc: "Train recall and pattern recognition" },
];

const STATS = [
  { value: "10K+", label: "OPERATORS" },
  { value: "5", label: "PROTOCOLS" },
  { value: "∞", label: "CHALLENGES" },
  { value: "24/7", label: "UPTIME" },
];

const RANKS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
const RANK_COLORS = {
  BRONZE: "#c97c3a", SILVER: "#9ba8b4", GOLD: "#d4a84b",
  PLATINUM: "#b8c4cc", DIAMOND: "#7eb8d4",
};

export default function Home() {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
      }
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .home {
          min-height: 100vh;
          background: #080a0e;
          color: #e8e8e0;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
        }

        .home::before {
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

        /* NAV */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 48px;
          background: rgba(8,10,14,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(212,168,75,0.12);
        }
        .nav-logo {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          font-weight: 900;
          color: #d4a84b;
          letter-spacing: 4px;
        }
        .nav-logo span { color: #7eb8d4; }
        .nav-links { display: flex; gap: 10px; }
        .nav-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          padding: 9px 22px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          border: none;
        }
        .nav-btn.ghost {
          background: transparent;
          border: 1px solid rgba(212,168,75,0.3);
          color: #d4a84b;
        }
        .nav-btn.ghost:hover { background: rgba(212,168,75,0.08); border-color: #d4a84b; }
        .nav-btn.solid {
          background: #d4a84b;
          border: 1px solid #d4a84b;
          color: #080a0e;
          font-weight: 700;
        }
        .nav-btn.solid:hover { background: #e0b85a; box-shadow: 0 0 24px rgba(212,168,75,0.3); }

        /* HERO */
        .hero {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }
        .hero-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 4px;
          color: #7eb8d4;
          border: 1px solid rgba(126,184,212,0.25);
          padding: 6px 18px;
          border-radius: 2px;
          margin-bottom: 32px;
          display: inline-block;
          animation: fadeUp 0.8s ease both;
        }
        .hero-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(42px, 8vw, 96px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
          margin-bottom: 12px;
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .hero-title .line1 { color: #e8e8e0; display: block; }
        .hero-title .line2 { color: #d4a84b; display: block; }
        .hero-title.glitch .line1 {
          text-shadow: 2px 0 #dc505a, -2px 0 #7eb8d4;
          transform: skewX(-1deg);
        }
        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: rgba(232,232,224,0.5);
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.2s ease both;
          letter-spacing: 0.5px;
        }
        .hero-cta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.3s ease both;
        }
        .cta-primary {
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          padding: 16px 40px;
          background: #d4a84b;
          color: #080a0e;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15), transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }
        .cta-primary:hover::after { transform: translateX(100%); }
        .cta-primary:hover { background: #e0b85a; box-shadow: 0 0 40px rgba(212,168,75,0.35), 0 0 80px rgba(212,168,75,0.1); transform: translateY(-2px); }
        .cta-secondary {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 3px;
          padding: 16px 36px;
          background: transparent;
          color: rgba(232,232,224,0.7);
          border: 1px solid rgba(232,232,224,0.15);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cta-secondary:hover { border-color: rgba(232,232,224,0.4); color: #e8e8e0; }

        .scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: fadeUp 1s 0.8s ease both;
        }
        .scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(212,168,75,0.6), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        .scroll-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 3px;
          color: rgba(212,168,75,0.4);
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* STATS */
        .stats-bar {
          position: relative;
          z-index: 1;
          background: rgba(212,168,75,0.04);
          border-top: 1px solid rgba(212,168,75,0.1);
          border-bottom: 1px solid rgba(212,168,75,0.1);
          padding: 40px 48px;
          display: flex;
          justify-content: center;
          gap: 80px;
          flex-wrap: wrap;
        }
        .stat-item { text-align: center; }
        .stat-val {
          font-family: 'Orbitron', monospace;
          font-size: 36px;
          font-weight: 900;
          color: #d4a84b;
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-lbl {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(232,232,224,0.35);
        }

        /* SECTION */
        .section {
          position: relative;
          z-index: 1;
          padding: 100px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header { margin-bottom: 56px; }
        .section-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 4px;
          color: #7eb8d4;
          margin-bottom: 12px;
          display: block;
        }
        .section-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 700;
          color: #e8e8e0;
          line-height: 1.1;
        }
        .section-title span { color: #d4a84b; }

        /* GAMES GRID */
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        .game-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .game-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--cc);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .game-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .game-card:hover::before { opacity: 1; }
        .card-icon {
          width: 52px; height: 52px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }
        .card-label {
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #e8e8e0;
          margin-bottom: 8px;
        }
        .card-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(232,232,224,0.45);
          line-height: 1.5;
        }

        /* RANKS */
        .ranks-section {
          position: relative;
          z-index: 1;
          padding: 80px 48px;
          background: rgba(212,168,75,0.02);
          border-top: 1px solid rgba(212,168,75,0.08);
          border-bottom: 1px solid rgba(212,168,75,0.08);
        }
        .ranks-inner { max-width: 1200px; margin: 0 auto; }
        .ranks-track {
          display: flex;
          gap: 12px;
          margin-top: 48px;
          align-items: center;
          flex-wrap: wrap;
        }
        .rank-badge {
          flex: 1;
          min-width: 100px;
          padding: 20px 16px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid transparent;
          transition: all 0.3s;
        }
        .rank-badge:hover { transform: translateY(-4px); }
        .rank-connector { width: 24px; height: 1px; flex-shrink: 0; }
        .rank-icon { font-size: 20px; display: block; margin-bottom: 8px; }
        .rank-name {
          font-family: 'Orbitron', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          display: block;
        }

        /* CTA BOTTOM */
        .cta-section {
          position: relative;
          z-index: 1;
          padding: 120px 48px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        /* FOOTER */
        .footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-logo {
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 900;
          color: #d4a84b;
          letter-spacing: 3px;
        }
        .footer-copy {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.2);
        }

        .divider {
          position: relative;
          z-index: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,168,75,0.3), rgba(126,184,212,0.2), transparent);
          margin: 0 48px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .stats-bar { gap: 40px; padding: 32px 20px; }
          .section { padding: 60px 20px; }
          .ranks-section { padding: 60px 20px; }
          .cta-section { padding: 80px 20px; }
          .footer { padding: 24px 20px; }
          .divider { margin: 0 20px; }
          .rank-connector { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">NEX<span>US</span></span>
        <div className="nav-links">
          <button className="nav-btn ghost" onClick={() => navigate("/login")}>LOGIN</button>
          <button className="nav-btn solid" onClick={() => navigate("/register")}>JOIN NOW</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <span className="hero-tag">// SYSTEM ONLINE — NEXUS v2.0</span>
        <h1 className={`hero-title ${glitch ? "glitch" : ""}`}>
          <span className="line1">ENTER THE</span>
          <span className="line2">NEXUS</span>
        </h1>
        <p className="hero-sub">
          The ultimate competitive gaming platform. Rise through ranks, challenge opponents, and prove your dominance across multiple protocols.
        </p>
        <div className="hero-cta">
          <button className="cta-primary" onClick={() => navigate("/register")}>INITIALIZE OPERATOR</button>
          <button className="cta-secondary" onClick={() => navigate("/login")}>EXISTING OPERATOR //</button>
        </div>
        <div className="scroll-hint">
          <span className="scroll-label">SCROLL</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {STATS.map((s) => (
          <div className="stat-item" key={s.label}>
            <span className="stat-val">{s.value}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* GAMES */}
      <div className="section">
        <div className="section-header">
          <span className="section-tag">// PROTOCOLS</span>
          <h2 className="section-title">CHOOSE YOUR<br /><span>BATTLEGROUND</span></h2>
        </div>
        <div className="games-grid">
          {GAMES.map((g) => (
            <div
              key={g.label}
              className="game-card"
              style={{ "--cc": g.color }}
              onClick={() => navigate("/register")}
            >
              <div className="card-icon" style={{ background: `${g.color}12`, color: g.color, border: `1px solid ${g.color}33` }}>{g.icon}</div>
              <div className="card-label">{g.label}</div>
              <div className="card-desc">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* RANKS */}
      <div className="ranks-section">
        <div className="ranks-inner">
          <span className="section-tag">// RANKING SYSTEM</span>
          <h2 className="section-title">PROVE YOUR <span>WORTH</span></h2>
          <div className="ranks-track">
            {RANKS.map((r, i) => (
              <div key={r} style={{ display: "contents" }}>
                <div
                  className="rank-badge"
                  style={{ borderColor: `${RANK_COLORS[r]}33`, background: `${RANK_COLORS[r]}08` }}
                >
                  <span className="rank-icon" style={{ color: RANK_COLORS[r] }}>◆</span>
                  <span className="rank-name" style={{ color: RANK_COLORS[r] }}>{r}</span>
                </div>
                {i < RANKS.length - 1 && (
                  <div
                    className="rank-connector"
                    style={{ background: `linear-gradient(90deg, ${RANK_COLORS[r]}, ${RANK_COLORS[RANKS[i + 1]]})` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* BOTTOM CTA */}
      <div className="cta-section">
        <span className="section-tag" style={{ display: "block", marginBottom: 12 }}>// READY?</span>
        <h2 className="section-title" style={{ marginBottom: 20 }}>
          YOUR <span>MISSION</span> AWAITS
        </h2>
        <p className="hero-sub" style={{ margin: "0 auto 48px" }}>
          Register now and begin your ascent from Bronze to Diamond. Every game, every point, every rank — it all starts here.
        </p>
        <button className="cta-primary" onClick={() => navigate("/register")}>
          DEPLOY OPERATOR
        </button>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-logo">NEXUS</span>
        <span className="footer-copy">// {new Date().getFullYear()} — ALL SYSTEMS OPERATIONAL</span>
      </footer>
    </div>
  );
}