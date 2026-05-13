import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AVATARS = [
  { icon: "🎮", label: "ROOKIE",   level: 0 },
  { icon: "🦊", label: "TRICKSTER", level: 0 },
  { icon: "🐺", label: "HOWLER",   level: 1 },
  { icon: "🤖", label: "UNIT-7",   level: 1 },
  { icon: "👾", label: "GLITCH",   level: 2 },
  { icon: "🧙", label: "CIPHER",   level: 2 },
  { icon: "⚡", label: "VOLTAGE",  level: 3 },
  { icon: "🐉", label: "APEX",     level: 4 },
];

const STRENGTH_CONFIG = [
  { label: "",       color: "transparent",  pct: 0   },
  { label: "WEAK",   color: "#dc505a",      pct: 25  },
  { label: "FAIR",   color: "#f39c12",      pct: 50  },
  { label: "GOOD",   color: "#2ecc71",      pct: 75  },
  { label: "STRONG", color: "#7eb8d4",      pct: 100 },
];

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const navigate = useNavigate();
  const userLevel = 1;

  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [selected, setSelected] = useState(AVATARS[0]);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const strength = getStrength(form.password);
  const si = STRENGTH_CONFIG[strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setStatus({ type: "error", message: "// PASSWORDS DO NOT MATCH" });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/auth/register", { ...form, avatarUrl: selected.icon });
      setStatus({ type: "success", message: "// OPERATOR CREATED — REDIRECTING" });
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "// REGISTRATION FAILED" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rg-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080a0e;
          font-family: 'Rajdhani', sans-serif;
          color: #e8e8e0;
          overflow: hidden;
          position: relative;
        }

        /* GRID BG */
        .rg-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,75,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,75,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* AMBIENT GLOW ORBS */
        .rg-page::after {
          content: '';
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,75,0.06) 0%, transparent 70%);
          top: -200px; left: -200px;
          pointer-events: none;
        }

        .rg-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 24px;
          animation: fadeUp 0.5s ease both;
        }

        /* LOGO */
        .rg-logo {
          font-family: 'Orbitron', monospace;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 6px;
          color: #d4a84b;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .rg-logo span { color: #7eb8d4; }
        .rg-eyebrow {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 4px;
          color: rgba(126,184,212,0.6);
          margin-bottom: 32px;
        }

        /* CARD */
        .rg-card {
          width: 100%;
          max-width: 460px;
          background: rgba(10,12,20,0.92);
          border: 1px solid rgba(212,168,75,0.15);
          border-radius: 12px;
          padding: 32px 28px 28px;
          box-shadow: 0 0 60px rgba(212,168,75,0.06), 0 0 120px rgba(0,0,0,0.6);
          position: relative;
          overflow: hidden;
        }
        .rg-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4a84b, #7eb8d4, transparent);
          opacity: 0.7;
        }

        /* SECTION LABEL */
        .rg-section-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 3px;
          color: rgba(212,168,75,0.5);
          margin-bottom: 12px;
          display: block;
        }

        /* AVATAR GRID */
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
          margin-bottom: 28px;
          padding: 16px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .avatar-slot {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
          position: relative;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s ease;
          user-select: none;
        }
        .avatar-slot:hover:not(.locked) {
          border-color: rgba(212,168,75,0.4);
          transform: scale(1.08);
          background: rgba(212,168,75,0.06);
        }
        .avatar-slot.active {
          border-color: #d4a84b;
          background: rgba(212,168,75,0.1);
          box-shadow: 0 0 20px rgba(212,168,75,0.25), inset 0 0 12px rgba(212,168,75,0.06);
          transform: scale(1.12);
        }
        .avatar-slot.locked {
          opacity: 0.28;
          cursor: not-allowed;
          filter: grayscale(0.6);
        }
        .lock-icon {
          position: absolute;
          bottom: 2px; right: 3px;
          font-size: 8px;
          color: rgba(255,255,255,0.4);
        }

        /* SELECTED PREVIEW */
        .avatar-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(212,168,75,0.05);
          border: 1px solid rgba(212,168,75,0.12);
          border-radius: 8px;
          margin-bottom: 28px;
        }
        .preview-icon {
          font-size: 32px;
          width: 52px; height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(212,168,75,0.08);
          border: 1px solid rgba(212,168,75,0.2);
          flex-shrink: 0;
        }
        .preview-info {}
        .preview-name {
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #d4a84b;
          letter-spacing: 2px;
        }
        .preview-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(232,232,224,0.3);
          letter-spacing: 2px;
          margin-top: 3px;
        }

        /* FIELDS */
        .field-wrap {
          position: relative;
          margin-bottom: 12px;
        }
        .field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 2.5px;
          color: rgba(212,168,75,0.5);
          display: block;
          margin-bottom: 5px;
        }
        .rg-input {
          width: 100%;
          padding: 11px 40px 11px 14px;
          border-radius: 6px;
          border: 1px solid rgba(212,168,75,0.12);
          background: rgba(0,0,0,0.45);
          color: #e8e8e0;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.5px;
        }
        .rg-input::placeholder { color: rgba(232,232,224,0.2); font-size: 13px; }
        .rg-input:focus {
          border-color: rgba(212,168,75,0.4);
          box-shadow: 0 0 0 2px rgba(212,168,75,0.08);
        }
        .toggle-btn {
          position: absolute;
          right: 12px;
          bottom: 11px;
          background: none;
          border: none;
          color: rgba(232,232,224,0.3);
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          transition: color 0.2s;
          padding: 0;
        }
        .toggle-btn:hover { color: #d4a84b; }

        /* STRENGTH */
        .strength-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: -4px 0 14px;
        }
        .strength-track {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
        }
        .strength-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.35s ease, background 0.35s ease;
        }
        .strength-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          min-width: 44px;
          text-align: right;
        }

        /* STATUS */
        .rg-status {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 14px;
        }
        .rg-status.error { color: #dc505a; background: rgba(220,80,90,0.08); border: 1px solid rgba(220,80,90,0.2); }
        .rg-status.success { color: #7eb8d4; background: rgba(126,184,212,0.08); border: 1px solid rgba(126,184,212,0.2); }

        /* SUBMIT */
        .rg-submit {
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          background: #d4a84b;
          border: none;
          border-radius: 6px;
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #080a0e;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .rg-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15), transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }
        .rg-submit:hover:not(:disabled)::after { transform: translateX(100%); }
        .rg-submit:hover:not(:disabled) { background: #e0b85a; box-shadow: 0 0 32px rgba(212,168,75,0.3); transform: translateY(-1px); }
        .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* FOOTER LINK */
        .rg-footer {
          margin-top: 18px;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.25);
        }
        .rg-footer a {
          color: #d4a84b;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rg-footer a:hover { color: #e0b85a; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="rg-wrap">
        <div className="rg-logo" onClick={() => navigate("/")}>NEX<span>US</span></div>
        <div className="rg-eyebrow">// OPERATOR REGISTRATION</div>

        <div className="rg-card">

          {/* AVATAR SELECT */}
          <span className="rg-section-label">// SELECT AVATAR — LOCKED AVATARS REQUIRE HIGHER RANK</span>
          <div className="avatar-grid">
            {AVATARS.map((a) => {
              const locked = a.level > userLevel;
              return (
                <div
                  key={a.icon}
                  className={`avatar-slot ${selected.icon === a.icon ? "active" : ""} ${locked ? "locked" : ""}`}
                  onClick={() => !locked && setSelected(a)}
                  title={locked ? `Requires level ${a.level}` : a.label}
                >
                  {a.icon}
                  {locked && <span className="lock-icon">🔒</span>}
                </div>
              );
            })}
          </div>

          {/* PREVIEW */}
          <div className="avatar-preview">
            <div className="preview-icon">{selected.icon}</div>
            <div className="preview-info">
              <div className="preview-name">{selected.label}</div>
              <div className="preview-tag">// OPERATOR IDENTITY SELECTED</div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <span className="rg-section-label">// CREDENTIALS</span>

            <div className="field-wrap">
              <label className="field-label">USERNAME</label>
              <input className="rg-input" name="username" placeholder="your_handle" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">EMAIL</label>
              <input className="rg-input" name="email" type="email" placeholder="operator@nexus.io" onChange={handleChange} required />
            </div>

            <div className="field-wrap">
              <label className="field-label">PASSWORD</label>
              <input
                className="rg-input"
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-btn" onClick={() => setShowPw(v => !v)}>
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* STRENGTH */}
            <div className="strength-row">
              <div className="strength-track">
                <div className="strength-fill" style={{ width: `${si.pct}%`, background: si.color }} />
              </div>
              <span className="strength-label" style={{ color: si.color }}>{si.label}</span>
            </div>

            <div className="field-wrap">
              <label className="field-label">CONFIRM PASSWORD</label>
              <input
                className="rg-input"
                name="confirm"
                type={showCf ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-btn" onClick={() => setShowCf(v => !v)}>
                {showCf ? "HIDE" : "SHOW"}
              </button>
            </div>

            {status && (
              <div className={`rg-status ${status.type}`}>{status.message}</div>
            )}

            <button className="rg-submit" type="submit" disabled={loading}>
              {loading ? "INITIALIZING..." : "DEPLOY OPERATOR //"}
            </button>
          </form>

          <div className="rg-footer">
            ALREADY REGISTERED? <a onClick={() => navigate("/login")}>ACCESS NEXUS</a>
          </div>
        </div>
      </div>
    </div>
  );
}