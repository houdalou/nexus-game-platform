import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Trophy, Gamepad2, Award, User, Settings, Menu, X, LogOut,
} from "lucide-react";
import api from "../../api/axios";
import scoreService from "../../services/scoreService";

const RANK_ORDER = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

const RANK_META = {
  BRONZE:   { emoji: "◆", color: "#c97c3a", next: "SILVER",   threshold: 500  },
  SILVER:   { emoji: "◆", color: "#9ba8b4", next: "GOLD",     threshold: 1500 },
  GOLD:     { emoji: "◆", color: "#d4a84b", next: "PLATINUM", threshold: 3000 },
  PLATINUM: { emoji: "◆", color: "#b8c4cc", next: "DIAMOND",  threshold: 6000 },
  DIAMOND:  { emoji: "◆", color: "#7eb8d4", next: null,       threshold: null },
};

const CAT_COLORS = {
  QUIZ:   { c: "#d4a84b", bg: "rgba(212,168,75,0.09)",  icon: "◎" },
  ARCADE: { c: "#dc505a", bg: "rgba(220,80,90,0.09)",   icon: "▣" },
  CHESS:  { c: "#7eb8d4", bg: "rgba(126,184,212,0.09)", icon: "◈" },
  MEMORY: { c: "#6aac7a", bg: "rgba(106,172,122,0.09)", icon: "◇" },
  WORD:   { c: "#d4a84b", bg: "rgba(212,168,75,0.09)",  icon: "◇" },
};

const NAV = [
  { icon: Home,      label: "Dashboard",    path: "/dashboard"    },
  { icon: Gamepad2,  label: "Games",        path: "/games"        },
  { icon: Trophy,    label: "Rankings",     path: "/rankings"     },
  { icon: Award,     label: "Achievements", path: "/achievements" },
  { icon: User,      label: "Profile",      path: "/profile"      },
  { icon: Settings,  label: "Settings",     path: "/settings"     },
];

function getRankProgress(rank, totalScore) {
  const meta = RANK_META[rank];
  if (!meta || !meta.next) return 100;
  const prevThreshold = rank === "BRONZE" ? 0 : RANK_META[RANK_ORDER[RANK_ORDER.indexOf(rank) - 1]].threshold;
  const range = meta.threshold - prevThreshold;
  return Math.min(100, Math.max(0, Math.round(((totalScore - prevThreshold) / range) * 100)));
}

export default function Dashboard() {
  const [games, setGames]           = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scores, setScores]         = useState([]);
  const [search, setSearch]         = useState("");
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [open, setOpen]             = useState(false);
  const [activeTab, setActiveTab]   = useState("games");

  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    Promise.all([fetchGames(), fetchLeaderboard(), fetchMe(), fetchScores()])
      .finally(() => setLoading(false));
  }, []);

  const fetchGames = async () => {
    try { const r = await api.get("/games"); setGames(r.data); } catch (e) { console.error(e); }
  };

  const fetchLeaderboard = async () => {
    try {
      const r = await scoreService.getLeaderboard();
      setLeaderboard(r.data.filter(p => p.role !== "ADMIN" && p.role !== "ROLE_ADMIN"));
    } catch (e) { console.error(e); }
  };

  const fetchMe = async () => {
    try {
      const r = await api.get("/users/me");
      setUser(r.data);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem("token"); navigate("/login");
      }
    }
  };

  const fetchScores = async () => {
    try { const r = await api.get("/quiz/sessions/me"); setScores(r.data); } catch (e) { console.error(e); }
  };

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const handlePlay = (game) => {
    const cat  = game.category?.toUpperCase();
    const slug = game.slug;
    if (cat === "QUIZ") navigate("/quiz");
    else if (cat === "ARCADE") {
      if (slug === "snake") navigate("/snake");
      else if (slug === "tetris") navigate("/tetris");
      else alert("Coming soon");
    } else if (cat === "CHESS") {
      if (slug === "chess") navigate("/chess");
      else alert("Coming soon");
    } else alert("Coming soon");
  };

  const filtered   = games.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
  const rank       = user?.rank || "BRONZE";
  const totalScore = user?.totalScore ?? 0;
  const level      = user?.level ?? 1;
  const avatar     = user?.avatarUrl || "🎮";
  const rankMeta   = RANK_META[rank] || RANK_META.BRONZE;
  const progress   = getRankProgress(rank, totalScore);
  const bestScore  = scores.length > 0 ? Math.max(...scores.map(s => s.points ?? s.score ?? 0)) : 0;
  const winRate    = scores.length > 0 ? Math.round((scores.filter(s => (s.points ?? s.score ?? 0) > 0).length / scores.length) * 100) : 0;

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#070b14", gap:16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap'); @keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:"2px solid rgba(212,168,75,0.15)",borderTopColor:"#d4a84b",borderRadius:"50%",animation:"_spin 1s linear infinite" }} />
      <p style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:4,color:"rgba(232,232,224,0.25)",margin:0 }}>INITIALIZING NEXUS...</p>
    </div>
  );

  return (
    <div className="nx-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080a0e; }

        .nx-root {
          min-height: 100vh;
          display: flex;
          background: #080a0e;
          color: #e8e8e0;
          font-family: 'Rajdhani', sans-serif;
          position: relative;
        }

        .nx-root::before {
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

        /* ── SIDEBAR ── */
        .nx-sidebar {
          width: 80px;
          background: rgba(8,10,14,0.96);
          border-right: 1px solid rgba(126,184,212,0.15);
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 200;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          transition: width 0.32s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .nx-sidebar.open { width: 240px; }

        .nx-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          min-height: 48px;
        }
        .nx-logo {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #7eb8d4;
          white-space: nowrap;
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.25s 0.05s, width 0.3s;
        }
        .nx-logo span { color: #d4a84b; }
        .nx-sidebar.open .nx-logo { opacity: 1; width: 120px; }

        .nx-menu-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(126,184,212,0.2);
          background: rgba(126,184,212,0.08);
          color: #7eb8d4;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .nx-menu-btn:hover { background: rgba(126,184,212,0.15); transform: scale(1.06); }

        .nx-nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }

        .nx-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          color: rgba(232,232,224,0.4);
          cursor: pointer;
          transition: all 0.22s;
          white-space: nowrap;
          overflow: hidden;
        }
        .nx-nav-item:hover { background: rgba(126,184,212,0.08); color: #7eb8d4; transform: translateX(3px); }
        .nx-nav-item.active {
          background: rgba(126,184,212,0.12);
          border-color: rgba(126,184,212,0.25);
          color: #7eb8d4;
        }
        .nx-nav-item svg { flex-shrink: 0; }
        .nx-nav-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.2s 0.08s, width 0.3s;
        }
        .nx-sidebar.open .nx-nav-label { opacity: 1; width: auto; }

        .nx-logout { margin-top: auto; color: #dc505a !important; }
        .nx-logout:hover { background: rgba(220,80,90,0.1) !important; color: #dc505a !important; }

        /* ── MAIN ── */
        .nx-main {
          flex: 1;
          margin-left: 80px;
          padding: 28px;
          min-height: 100vh;
          transition: margin-left 0.32s cubic-bezier(.4,0,.2,1);
          position: relative;
          z-index: 5;
        }
        .nx-sidebar.open ~ .nx-main { margin-left: 240px; }

        /* ── TOPBAR ── */
        .nx-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 16px;
          padding: 22px 28px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 40px rgba(126,184,212,0.1);
          position: relative;
          overflow: hidden;
          flex-wrap: wrap;
          gap: 16px;
        }
        .nx-topbar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #7eb8d4, #d4a84b, transparent);
          opacity: 0.5;
        }
        .nx-profile { display: flex; align-items: center; gap: 18px; }
        .nx-avatar {
          width: 72px; height: 72px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(126,184,212,0.15), rgba(212,168,75,0.05));
          border: 1px solid rgba(126,184,212,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          box-shadow: 0 0 28px rgba(126,184,212,0.15);
          flex-shrink: 0;
        }
        .nx-username {
          font-family: 'Orbitron', monospace;
          font-size: 28px;
          font-weight: 900;
          color: #7eb8d4;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .nx-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.35);
        }
        .nx-sub span { color: rgba(212,168,75,0.7); }
        .nx-topbar-right { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .nx-xp-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.5);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 999px;
          padding: 8px 18px;
          background: rgba(126,184,212,0.05);
        }
        .nx-rank-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid transparent;
        }

        /* ── STATS ── */
        .nx-stats {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
        }
        @media (max-width: 1000px) { .nx-stats { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px)  { .nx-stats { grid-template-columns: 1fr; } }

        .nx-stat {
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 12px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: border-color 0.25s;
        }
        .nx-stat:hover { border-color: rgba(126,184,212,0.4); }
        .nx-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--sc, #7eb8d4), transparent);
          opacity: 0.65;
        }
        .nx-stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 3px;
          color: rgba(232,232,224,0.35);
          margin-bottom: 10px;
        }
        .nx-stat-val {
          font-family: 'Orbitron', monospace;
          font-size: 26px;
          font-weight: 700;
          color: var(--sc, #e8e8e0);
          margin-bottom: 4px;
        }
        .nx-stat-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.25);
        }
        .nx-prog-track {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 14px;
        }
        .nx-prog-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.9s ease;
        }

        /* ── CONTROLS ── */
        .nx-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .nx-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .nx-search-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: rgba(232,232,224,0.25);
          pointer-events: none;
        }
        .nx-search {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border-radius: 12px;
          border: 1px solid rgba(126,184,212,0.2);
          background: rgba(8,10,14,0.85);
          color: #e8e8e0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          outline: none;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nx-search::placeholder { color: rgba(232,232,224,0.25); }
        .nx-search:focus { border-color: rgba(126,184,212,0.4); box-shadow: 0 0 0 2px rgba(126,184,212,0.1); }

        .nx-tabs { display: flex; gap: 8px; }
        .nx-tab {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 10px 22px;
          border-radius: 12px;
          border: 1px solid rgba(126,184,212,0.2);
          background: transparent;
          color: rgba(232,232,224,0.35);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .nx-tab.active { border-color: rgba(126,184,212,0.4); color: #7eb8d4; background: rgba(126,184,212,0.1); }
        .nx-tab:hover:not(.active) { border-color: rgba(126,184,212,0.3); color: rgba(232,232,224,0.55); }

        /* ── CONTENT LAYOUT ── */
        .nx-content { display: flex; gap: 20px; align-items: flex-start; }
        @media (max-width: 960px) { .nx-content { flex-direction: column; } }
        .nx-panel { flex: 2; min-width: 0; }
        .nx-sidebar-panel {
          flex: 1;
          min-width: 260px;
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        .nx-sidebar-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #7eb8d4, #d4a84b, transparent);
          opacity: 0.45;
        }
        @media (max-width: 960px) { .nx-sidebar-panel { width: 100%; min-width: 0; } }
        .nx-panel-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(232,232,224,0.35);
          margin-bottom: 16px;
        }

        /* ── GAMES ── */
        .nx-games { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .nx-game-card {
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 12px;
          padding: 20px;
          display: flex; flex-direction: column; gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .nx-game-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: var(--gc, #7eb8d4);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .nx-game-card:hover { transform: translateY(-6px); border-color: rgba(126,184,212,0.4); box-shadow: 0 20px 50px rgba(126,184,212,0.2); }
        .nx-game-card:hover::after { opacity: 0.8; }
        .nx-game-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .nx-game-cat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid;
          width: fit-content;
        }
        .nx-game-title {
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #e8e8e0;
          letter-spacing: 0.5px;
        }
        .nx-game-desc { font-size: 12px; color: rgba(232,232,224,0.4); line-height: 1.5; }
        .nx-play-btn {
          margin-top: auto;
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid var(--gc-dim, rgba(126,184,212,0.3));
          background: var(--gc-bg, rgba(126,184,212,0.1));
          color: var(--gc, #7eb8d4);
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nx-play-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }

        /* ── HISTORY ── */
        .nx-history { display: flex; flex-direction: column; gap: 10px; }
        .nx-hist-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          border-radius: 12px;
          padding: 14px 18px;
          transition: border-color 0.2s;
          backdrop-filter: blur(10px);
        }
        .nx-hist-item:hover { border-color: rgba(126,184,212,0.4); }
        .nx-hist-cat {
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #e8e8e0;
          margin-bottom: 3px;
          letter-spacing: 1px;
        }
        .nx-hist-date { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: rgba(232,232,224,0.3); letter-spacing: 1px; }
        .nx-hist-score { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: rgba(232,232,224,0.35); margin-bottom: 3px; }
        .nx-hist-pts { font-family: 'Orbitron', monospace; font-size: 14px; font-weight: 700; color: #d4a84b; }

        /* ── LEADERBOARD ── */
        .nx-lb { display: flex; flex-direction: column; gap: 6px; }
        .nx-lb-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .nx-lb-item:hover { background: rgba(126,184,212,0.05); }
        .nx-lb-item.gold { border-color: rgba(212,168,75,0.3); background: rgba(212,168,75,0.06); }
        .nx-lb-item.self { border-color: rgba(126,184,212,0.3); background: rgba(126,184,212,0.06); }
        .nx-lb-pos { font-family: 'Orbitron', monospace; font-size: 11px; font-weight: 700; color: rgba(232,232,224,0.3); min-width: 24px; }
        .nx-lb-pos.gold { color: #d4a84b; }
        .nx-lb-name { flex: 1; font-size: 13px; font-weight: 500; color: #e8e8e0; }
        .nx-lb-you {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 1px;
          color: #7eb8d4;
          background: rgba(126,184,212,0.15);
          padding: 2px 8px;
          border-radius: 999px;
          margin-left: 6px;
        }
        .nx-lb-score { font-family: 'Orbitron', monospace; font-size: 13px; font-weight: 700; color: #d4a84b; text-align: right; }
        .nx-lb-badge { font-family: 'Share Tech Mono', monospace; font-size: 9px; letter-spacing: 1px; color: rgba(232,232,224,0.3); text-align: right; margin-top: 2px; }

        .nx-empty {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.25);
          text-align: center;
          padding: 32px 0;
        }

        @media (max-width: 900px) {
          .nx-main { margin-left: 80px !important; padding: 16px; }
          .nx-sidebar.open ~ .nx-main { margin-left: 240px !important; }
          .nx-topbar { padding: 18px; }
          .nx-username { font-size: 22px; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div className={`nx-sidebar ${open ? "open" : ""}`}>
        <div className="nx-sidebar-head">
          <div className="nx-logo">NEX<span>US</span></div>
          <button className="nx-menu-btn" onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="nx-nav">
          {NAV.map(({ icon: Icon, label, path }) => (
            <div
              key={path}
              className={`nx-nav-item ${location.pathname === path ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={20} />
              <span className="nx-nav-label">{label}</span>
            </div>
          ))}

          <div className="nx-nav-item nx-logout" onClick={logout}>
            <LogOut size={20} />
            <span className="nx-nav-label">Disconnect</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="nx-main">

        {/* TOPBAR */}
        <div className="nx-topbar">
          <div className="nx-profile">
            <div className="nx-avatar">{avatar}</div>
            <div>
              <div className="nx-username">{user?.username || "UNKNOWN"}</div>
              <div className="nx-sub">
                LV.{level}&nbsp;&nbsp;<span>◆</span>&nbsp;&nbsp;{rank}&nbsp;&nbsp;<span>◆</span>&nbsp;&nbsp;{totalScore} XP
              </div>
            </div>
          </div>
          <div className="nx-topbar-right">
            <div className="nx-xp-pill">⚡ {progress}% TO {rankMeta.next || "MAX"}</div>
            <div className="nx-rank-pill" style={{ color: rankMeta.color, borderColor: `${rankMeta.color}33`, background: `${rankMeta.color}0d` }}>
              {rankMeta.emoji} {rank}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="nx-stats">
          <div className="nx-stat" style={{ "--sc": rankMeta.color }}>
            <div className="nx-stat-label">CURRENT RANK</div>
            <div className="nx-stat-val">{rankMeta.emoji} {rank}</div>
            {rankMeta.next
              ? <>
                  <div className="nx-prog-track">
                    <div className="nx-prog-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${rankMeta.color}, ${rankMeta.color}88)` }} />
                  </div>
                  <div className="nx-stat-hint" style={{ marginTop: 6 }}>{progress}% → {rankMeta.next} // {rankMeta.threshold - totalScore} PTS LEFT</div>
                </>
              : <div className="nx-stat-hint" style={{ color: rankMeta.color, marginTop: 8 }}>MAXIMUM RANK ACHIEVED</div>
            }
          </div>
          <div className="nx-stat" style={{ "--sc": "#d4a84b" }}>
            <div className="nx-stat-label">TOTAL SCORE</div>
            <div className="nx-stat-val">{totalScore}</div>
            <div className="nx-stat-hint">CUMULATIVE XP</div>
          </div>
          <div className="nx-stat" style={{ "--sc": "#7eb8d4" }}>
            <div className="nx-stat-label">SESSIONS</div>
            <div className="nx-stat-val">{scores.length}</div>
            <div className="nx-stat-hint">WIN RATE {winRate}%</div>
          </div>
          <div className="nx-stat" style={{ "--sc": "#6aac7a" }}>
            <div className="nx-stat-label">BEST SCORE</div>
            <div className="nx-stat-val">{bestScore}</div>
            <div className="nx-stat-hint">PERSONAL RECORD</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="nx-controls">
          <div className="nx-search-wrap">
            <span className="nx-search-icon">//</span>
            <input className="nx-search" placeholder="SEARCH PROTOCOLS..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="nx-tabs">
            <button className={`nx-tab ${activeTab === "games" ? "active" : ""}`} onClick={() => setActiveTab("games")}>GAMES</button>
            <button className={`nx-tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>LOGS</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="nx-content">
          <div className="nx-panel">

            {/* GAMES */}
            {activeTab === "games" && (
              filtered.length === 0
                ? <p className="nx-empty">// NO PROTOCOLS FOUND</p>
                : <div className="nx-games">
                    {filtered.map(game => {
                      const s = CAT_COLORS[game.category?.toUpperCase()] || CAT_COLORS.QUIZ;
                      return (
                        <div
                          key={game.id}
                          className="nx-game-card"
                          style={{ "--gc": s.c, "--gc-bg": s.bg, "--gc-dim": `${s.c}33` }}
                          onClick={() => handlePlay(game)}
                        >
                          <div className="nx-game-icon" style={{ background: s.bg, color: s.c, border: `1px solid ${s.c}33` }}>{s.icon}</div>
                          <div className="nx-game-cat" style={{ color: s.c, borderColor: `${s.c}33`, background: s.bg }}>{s.icon} {game.category}</div>
                          <div className="nx-game-title">{game.title}</div>
                          <div className="nx-game-desc">{game.description}</div>
                          <button className="nx-play-btn" onClick={e => { e.stopPropagation(); handlePlay(game); }}>INITIATE //</button>
                        </div>
                      );
                    })}
                  </div>
            )}

            {/* HISTORY */}
            {activeTab === "history" && (
              <div className="nx-history">
                {scores.length === 0
                  ? <p className="nx-empty">// NO SESSION LOGS FOUND</p>
                  : [...scores].reverse().map((s, i) => (
                      <div key={i} className="nx-hist-item">
                        <div>
                          <div className="nx-hist-cat">{s.category || "QUIZ"}</div>
                          <div className="nx-hist-date">{s.endTime ? new Date(s.endTime).toLocaleDateString() : "—"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="nx-hist-score">{s.correctAnswers ?? "?"}/{s.totalQuestions ?? "?"} CORRECT</div>
                          <div className="nx-hist-pts">+{s.points ?? s.score ?? 0} PTS</div>
                        </div>
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          {/* LEADERBOARD */}
          <div className="nx-sidebar-panel">
            <div className="nx-panel-title">// LEADERBOARD</div>
            <div className="nx-lb">
              {leaderboard.length === 0
                ? <p className="nx-empty">// NO DATA</p>
                : leaderboard.map((u, i) => (
                    <div key={i} className={`nx-lb-item ${i === 0 ? "gold" : ""} ${u.username === user?.username ? "self" : ""}`}>
                      <span className={`nx-lb-pos ${i === 0 ? "gold" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="nx-lb-name">
                        {u.username}
                        {u.username === user?.username && <span className="nx-lb-you">YOU</span>}
                      </span>
                      <div>
                        <div className="nx-lb-score">{u.totalScore}</div>
                        <div className="nx-lb-badge">{u.rank || u.badge || "BRONZE"}</div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}