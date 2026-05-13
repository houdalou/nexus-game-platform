import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Trophy, Gamepad2, Award, User, Settings, Menu, X, LogOut, Heart, Star, MessageSquare,
} from "lucide-react";
import api from "../../api/axios";
import scoreService from "../../services/scoreService";

const RANK_ORDER = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

const RANK_META = {
  BRONZE:   { label: "Bronze",   color: "#c97c3a", bg: "rgba(201,124,58,0.12)",  border: "rgba(201,124,58,0.3)",  next: "SILVER",   threshold: 500  },
  SILVER:   { label: "Silver",   color: "#9ba8b4", bg: "rgba(155,168,180,0.12)", border: "rgba(155,168,180,0.3)", next: "GOLD",     threshold: 1500 },
  GOLD:     { label: "Gold",     color: "#e6b84a", bg: "rgba(230,184,74,0.12)",  border: "rgba(230,184,74,0.3)",  next: "PLATINUM", threshold: 3000 },
  PLATINUM: { label: "Platinum", color: "#a8d4e0", bg: "rgba(168,212,224,0.12)", border: "rgba(168,212,224,0.3)", next: "DIAMOND",  threshold: 6000 },
  DIAMOND:  { label: "Diamond",  color: "#7eb8d4", bg: "rgba(126,184,212,0.12)", border: "rgba(126,184,212,0.3)", next: null,       threshold: null },
};

const CAT_META = {
  QUIZ:   { color: "#e6b84a", bg: "rgba(230,184,74,0.1)",   border: "rgba(230,184,74,0.25)",   icon: "◎", label: "Quiz"   },
  ARCADE: { color: "#e05c68", bg: "rgba(224,92,104,0.1)",   border: "rgba(224,92,104,0.25)",   icon: "▣", label: "Arcade" },
  CHESS:  { color: "#7eb8d4", bg: "rgba(126,184,212,0.1)",  border: "rgba(126,184,212,0.25)",  icon: "◈", label: "Chess"  },
  MEMORY: { color: "#6aac7a", bg: "rgba(106,172,122,0.1)",  border: "rgba(106,172,122,0.25)",  icon: "◇", label: "Memory" },
  WORD:   { color: "#e6b84a", bg: "rgba(230,184,74,0.1)",   border: "rgba(230,184,74,0.25)",   icon: "◇", label: "Word"   },
};

const NAV = [
  { icon: Home,     label: "Dashboard",    path: "/dashboard"    },
  { icon: Gamepad2, label: "Games",        path: "/games"        },
  { icon: Trophy,   label: "Rankings",     path: "/rankings"     },
  { icon: Award,    label: "Achievements", path: "/achievements" },
  { icon: User,     label: "Profile",      path: "/profile"      },
  { icon: Settings, label: "Settings",     path: "/settings"     },
];

function getRankProgress(rank, totalScore) {
  const meta = RANK_META[rank];
  if (!meta || !meta.next) return 100;
  const idx = RANK_ORDER.indexOf(rank);
  const prevThreshold = idx === 0 ? 0 : RANK_META[RANK_ORDER[idx - 1]].threshold;
  const range = meta.threshold - prevThreshold;
  return Math.min(100, Math.max(0, Math.round(((totalScore - prevThreshold) / range) * 100)));
}

export default function Dashboard() {
  const [games, setGames]             = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scores, setScores]           = useState([]);
  const [search, setSearch]           = useState("");
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [open, setOpen]               = useState(false);
  const [activeTab, setActiveTab]     = useState("games");
  const [favorites, setFavorites]     = useState([]);
  const [ratings, setRatings]         = useState({});
  const [gameRatings, setGameRatings] = useState({});
  const [comments, setComments]       = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    Promise.all([fetchGames(), fetchLeaderboard(), fetchMe(), fetchScores(), fetchFavorites(), fetchRatings()])
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
    try { const r = await api.get("/users/me"); setUser(r.data); }
    catch (e) {
      console.error(e);
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem("token"); navigate("/login");
      }
    }
  };
  const fetchScores = async () => {
    try { const r = await api.get("/quiz/sessions/me"); setScores(r.data); } catch (e) { console.error(e); }
  };
  const fetchFavorites = async () => {
    try { 
      const r = await api.get("/favorites"); 
      setFavorites((r.data || []).filter(f => f.game));
    } catch (e) { console.error(e); }
  };
  const fetchRatings = async () => {
    try { 
      const r = await api.get("/ratings"); 
      const userRatings = {};
      (r.data || []).forEach(rating => {
        if (rating?.game?.id) {
          userRatings[rating.game.id] = rating.rating;
        }
      });
      setRatings(userRatings);
    } catch (e) { console.error(e); }
  };
  const fetchGameRating = async (gameId) => {
    try { 
      const r = await api.get(`/ratings/game/${gameId}/average`); 
      setGameRatings(prev => ({ ...prev, [gameId]: r.data }));
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async (gameId) => {
    try {
      const isFav = isGameFavorited(gameId);
      if (isFav) {
        await api.delete(`/favorites/${gameId}`);
        setFavorites(prev => Array.isArray(prev) ? prev.filter(f => f?.game && f.game.id !== gameId) : []);
      } else {
        await api.post(`/favorites/${gameId}`);
        await fetchFavorites();
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
      if (e.response?.status === 400 || e.message?.includes('Already in favorites')) {
        await fetchFavorites();
      }
    }
  };

  const addRating = async (gameId, rating) => {
    try {
      await api.post(`/ratings/${gameId}`, { rating });
      setRatings(prev => ({ ...prev, [gameId]: rating }));
      fetchGameRating(gameId);
    } catch (e) { console.error(e); }
  };

  const fetchComments = async (gameId) => {
    try {
      const r = await api.get(`/comments/game/${gameId}`);
      setComments(prev => ({ ...prev, [gameId]: (r.data || []).filter(c => c && c.id) }));
    } catch (e) { console.error(e); }
  };

  const addComment = async (gameId) => {
    const content = commentInput[gameId];
    if (!content || !content.trim()) return;
    try {
      await api.post(`/comments/${gameId}`, { content: content.trim() });
      setCommentInput(prev => ({ ...prev, [gameId]: "" }));
      fetchComments(gameId);
    } catch (e) { console.error(e); }
  };

  const deleteComment = async (commentId, gameId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => ({ 
        ...prev, 
        [gameId]: (prev[gameId] || []).filter(c => c && c.id !== commentId) 
      }));
    } catch (e) { console.error(e); }
  };

  const toggleComments = async (gameId) => {
    if (!showComments[gameId]) {
      await fetchComments(gameId);
    }
    setShowComments(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const isGameFavorited = (gameId) => {
    try {
      if (!Array.isArray(favorites)) return false;
      return favorites.some(f => f?.game && typeof f.game.id === 'number' && f.game.id === gameId);
    } catch (e) {
      console.error('Error checking favorite status:', e);
      return false;
    }
  };

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
  const winRate    = scores.length > 0
    ? Math.round((scores.filter(s => (s.points ?? s.score ?? 0) > 0).length / scores.length) * 100)
    : 0;

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#06080f", gap: 16,
    }}>
      <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: 36, height: 36,
        border: "1.5px solid rgba(126,184,212,0.15)",
        borderTopColor: "#7eb8d4",
        borderRadius: "50%",
        animation: "_spin 0.9s linear infinite",
      }} />
      <p style={{
        fontFamily: "monospace", fontSize: 11, letterSpacing: 4,
        color: "rgba(200,210,220,0.3)", margin: 0,
      }}>LOADING…</p>
    </div>
  );

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="nx-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .nx-root{
          min-height:100vh;
          display:flex;
          background:#06080f;
          color:#d8dde8;
          font-family:'Inter',system-ui,sans-serif;
          position:relative;
        }

        /* subtle grid overlay */
        .nx-root::before{
          content:'';
          position:fixed;inset:0;
          background-image:
            linear-gradient(rgba(126,184,212,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(126,184,212,0.025) 1px,transparent 1px);
          background-size:56px 56px;
          pointer-events:none;z-index:0;
        }

        /* ── SIDEBAR ── */
        .nx-sidebar{
          width:72px;
          background:rgba(8,11,20,0.97);
          border-right:1px solid rgba(255,255,255,0.06);
          position:fixed;left:0;top:0;bottom:0;
          z-index:300;
          padding:16px 12px;
          display:flex;flex-direction:column;
          transition:width 0.3s cubic-bezier(.4,0,.2,1);
          overflow:hidden;
        }
        .nx-sidebar.open{width:232px}

        .nx-sidebar-head{
          display:flex;align-items:center;
          justify-content:space-between;
          margin-bottom:24px;min-height:44px;
        }
        .nx-logo{
          font-family:'JetBrains Mono',monospace;
          font-size:16px;font-weight:500;
          letter-spacing:6px;
          background:linear-gradient(135deg,#7eb8d4,#d4a84b);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
          white-space:nowrap;opacity:0;width:0;overflow:hidden;
          transition:opacity 0.2s 0.06s,width 0.3s;
        }
        .nx-sidebar.open .nx-logo{opacity:1;width:130px}

        .nx-menu-btn{
          width:44px;height:44px;border-radius:10px;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.04);
          color:rgba(200,210,220,0.7);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;
          transition:background 0.2s,color 0.2s;
        }
        .nx-menu-btn:hover{background:rgba(126,184,212,0.12);color:#7eb8d4}

        .nx-nav{display:flex;flex-direction:column;gap:4px;flex:1}

        .nx-nav-item{
          display:flex;align-items:center;gap:12px;
          padding:12px;border-radius:10px;
          border:1px solid transparent;
          color:rgba(200,210,220,0.4);
          cursor:pointer;
          transition:all 0.2s;white-space:nowrap;overflow:hidden;
        }
        .nx-nav-item:hover{background:rgba(126,184,212,0.07);color:rgba(200,210,220,0.75);border-color:rgba(126,184,212,0.1)}
        .nx-nav-item.active{background:rgba(126,184,212,0.1);border-color:rgba(126,184,212,0.2);color:#7eb8d4}
        .nx-nav-item svg{flex-shrink:0}
        .nx-nav-label{
          font-size:13px;font-weight:500;letter-spacing:0.2px;
          opacity:0;width:0;overflow:hidden;
          transition:opacity 0.18s 0.06s,width 0.3s;
        }
        .nx-sidebar.open .nx-nav-label{opacity:1;width:auto}
        .nx-logout{margin-top:auto}
        .nx-logout:hover{background:rgba(220,80,90,0.08)!important;color:#e05c68!important;border-color:rgba(220,80,90,0.15)!important}

        /* ── MAIN ── */
        .nx-main{
          flex:1;margin-left:72px;padding:24px;
          min-height:100vh;
          transition:margin-left 0.3s cubic-bezier(.4,0,.2,1);
          position:relative;z-index:5;
        }
        .nx-sidebar.open ~ .nx-main{margin-left:232px}

        /* ── TOPBAR ── */
        .nx-topbar{
          display:flex;justify-content:space-between;align-items:center;
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;padding:20px 24px;
          margin-bottom:20px;
          flex-wrap:wrap;gap:16px;
          position:relative;overflow:hidden;
        }
        .nx-topbar::after{
          content:'';position:absolute;
          top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent 0%,rgba(126,184,212,0.4) 35%,rgba(212,168,75,0.4) 65%,transparent 100%);
        }

        .nx-profile{display:flex;align-items:center;gap:16px}
        .nx-avatar{
          width:60px;height:60px;border-radius:14px;
          background:rgba(126,184,212,0.08);
          border:1px solid rgba(126,184,212,0.18);
          display:flex;align-items:center;justify-content:center;
          font-size:28px;flex-shrink:0;
        }
        .nx-username{
          font-size:22px;font-weight:700;
          color:#d8dde8;letter-spacing:-0.3px;
          margin-bottom:4px;
        }
        .nx-user-meta{
          display:flex;align-items:center;gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:11px;color:rgba(200,210,220,0.35);letter-spacing:1px;
        }
        .nx-user-dot{color:rgba(126,184,212,0.4)}

        .nx-topbar-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
        .nx-badge{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:1.5px;
          padding:7px 16px;border-radius:8px;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.04);
          color:rgba(200,210,220,0.45);
        }
        .nx-rank-badge{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:1.5px;
          padding:7px 16px;border-radius:8px;
          border-width:1px;border-style:solid;
          font-weight:500;
        }

        /* ── STAT GRID ── */
        .nx-stats{
          display:grid;
          grid-template-columns:2fr 1fr 1fr 1fr;
          gap:12px;margin-bottom:20px;
        }
        @media(max-width:1000px){.nx-stats{grid-template-columns:1fr 1fr}}
        @media(max-width:560px){.nx-stats{grid-template-columns:1fr}}

        .nx-stat{
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:18px 20px;
          position:relative;overflow:hidden;
          transition:border-color 0.2s,transform 0.2s;
        }
        .nx-stat:hover{border-color:rgba(255,255,255,0.13);transform:translateY(-1px)}
        .nx-stat::before{
          content:'';position:absolute;
          top:0;left:20%;right:20%;height:1px;
          background:var(--sc,rgba(126,184,212,0.5));
          opacity:0.6;
        }
        .nx-stat-label{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:2px;
          color:rgba(200,210,220,0.3);
          text-transform:uppercase;margin-bottom:12px;
        }
        .nx-stat-val{
          font-size:28px;font-weight:700;
          color:var(--sc,#d8dde8);
          letter-spacing:-0.5px;margin-bottom:4px;
          line-height:1;
        }
        .nx-stat-hint{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:1px;
          color:rgba(200,210,220,0.25);
          margin-top:10px;
        }
        .nx-prog-track{
          height:3px;background:rgba(255,255,255,0.05);
          border-radius:99px;overflow:hidden;margin-top:12px;
        }
        .nx-prog-fill{
          height:100%;border-radius:99px;
          transition:width 1s cubic-bezier(.4,0,.2,1);
        }

        /* ── CONTROLS ── */
        .nx-controls{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}

        .nx-search-wrap{position:relative;flex:1;min-width:200px}
        .nx-search-icon{
          position:absolute;left:14px;top:50%;transform:translateY(-50%);
          font-size:14px;color:rgba(200,210,220,0.2);pointer-events:none;
        }
        .nx-search{
          width:100%;padding:11px 16px 11px 40px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(10,13,24,0.9);
          color:#d8dde8;
          font-family:'JetBrains Mono',monospace;
          font-size:12px;letter-spacing:0.5px;
          outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .nx-search::placeholder{color:rgba(200,210,220,0.2)}
        .nx-search:focus{border-color:rgba(126,184,212,0.3);box-shadow:0 0 0 3px rgba(126,184,212,0.07)}

        .nx-tabs{display:flex;gap:6px}
        .nx-tab{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:2px;text-transform:uppercase;
          padding:10px 20px;border-radius:10px;
          border:1px solid rgba(255,255,255,0.07);
          background:transparent;
          color:rgba(200,210,220,0.3);
          cursor:pointer;white-space:nowrap;
          transition:all 0.2s;
        }
        .nx-tab.active{
          border-color:rgba(126,184,212,0.25);
          color:#7eb8d4;
          background:rgba(126,184,212,0.08);
        }
        .nx-tab:hover:not(.active){color:rgba(200,210,220,0.55);border-color:rgba(255,255,255,0.12)}

        /* ── LAYOUT ── */
        .nx-content{display:flex;gap:18px;align-items:flex-start}
        @media(max-width:960px){.nx-content{flex-direction:column}}
        .nx-panel{flex:2;min-width:0}

        .nx-side-panel{
          flex:1;min-width:250px;
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:18px;
          position:relative;overflow:hidden;
        }
        .nx-side-panel::after{
          content:'';position:absolute;top:0;left:15%;right:15%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(126,184,212,0.35),rgba(212,168,75,0.35),transparent);
        }
        @media(max-width:960px){.nx-side-panel{width:100%;min-width:0}}
        .nx-panel-title{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:2.5px;text-transform:uppercase;
          color:rgba(200,210,220,0.3);margin-bottom:14px;
        }

        /* ── GAME CARDS ── */
        .nx-games{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(195px,1fr));
          gap:12px;
        }
        .nx-game-card{
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:18px;
          display:flex;flex-direction:column;gap:10px;
          cursor:pointer;
          position:relative;overflow:hidden;
          transition:border-color 0.25s,transform 0.25s;
        }
        .nx-game-card::before{
          content:'';position:absolute;
          top:0;left:0;right:0;height:2px;
          background:var(--gc,rgba(126,184,212,0.5));
          opacity:0;transition:opacity 0.25s;
        }
        .nx-game-card:hover{
          border-color:rgba(255,255,255,0.14);
          transform:translateY(-4px);
        }
        .nx-game-card:hover::before{opacity:1}

        .nx-game-icon{
          width:42px;height:42px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;flex-shrink:0;
        }
        .nx-game-cat{
          display:inline-flex;align-items:center;gap:5px;
          font-family:'JetBrains Mono',monospace;
          font-size:9px;letter-spacing:1.5px;text-transform:uppercase;
          padding:4px 9px;border-radius:6px;border-width:1px;border-style:solid;
          width:fit-content;
        }
        .nx-game-title{
          font-size:15px;font-weight:600;
          color:#d8dde8;letter-spacing:-0.2px;
        }
        .nx-game-desc{font-size:12px;color:rgba(200,210,220,0.35);line-height:1.6}
        .nx-play-btn{
          margin-top:auto;width:100%;
          padding:9px;border-radius:9px;
          border:1px solid var(--gc-dim,rgba(126,184,212,0.25));
          background:var(--gc-bg,rgba(126,184,212,0.07));
          color:var(--gc,#7eb8d4);
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:2px;text-transform:uppercase;
          cursor:pointer;
          transition:all 0.2s;
        }
        .nx-play-btn:hover{background:var(--gc-bg-h,rgba(126,184,212,0.14));transform:translateY(-1px)}

        /* ── INTERACTIONS ── */
        .nx-game-actions{
          display:flex;align-items:center;gap:8px;
          margin-top:auto;padding-top:10px;
          border-top:1px solid rgba(255,255,255,0.05);
        }
        .nx-fav-btn{
          width:32px;height:32px;border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.03);
          color:rgba(200,210,220,0.4);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all 0.2s;flex-shrink:0;
        }
        .nx-fav-btn:hover{background:rgba(255,255,255,0.06);color:rgba(200,210,220,0.6)}
        .nx-fav-btn.active{color:#e05c68;border-color:rgba(224,92,104,0.3);background:rgba(224,92,104,0.08)}
        .nx-rating-stars{
          display:flex;gap:3px;align-items:center;
        }
        .nx-star{
          width:16px;height:16px;color:rgba(200,210,220,0.2);
          cursor:pointer;transition:all 0.15s;
        }
        .nx-star:hover{color:rgba(200,210,220,0.5)}
        .nx-star.filled{color:#e6b84a}
        .nx-rating-display{
          font-family:'JetBrains Mono',monospace;
          font-size:9px;color:rgba(200,210,220,0.25);letter-spacing:0.5px;
          display:flex;align-items:center;gap:4px;
        }

        /* ── COMMENTS ── */
        .nx-comment-toggle{
          font-family:'JetBrains Mono',monospace;
          font-size:8px;letter-spacing:1px;text-transform:uppercase;
          color:rgba(200,210,220,0.25);
          cursor:pointer;display:flex;align-items:center;gap:4px;
          transition:color 0.2s;
        }
        .nx-comment-toggle:hover{color:rgba(200,210,220,0.45)}
        .nx-comments-section{
          margin-top:12px;padding-top:12px;
          border-top:1px solid rgba(255,255,255,0.05);
          display:none;
        }
        .nx-comments-section.open{display:block}
        .nx-comment-input-wrap{
          display:flex;gap:8px;margin-bottom:10px;
        }
        .nx-comment-input{
          flex:1;padding:8px 12px;border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(10,13,24,0.9);
          color:#d8dde8;
          font-family:'Inter',sans-serif;
          font-size:11px;outline:none;
        }
        .nx-comment-input:focus{border-color:rgba(126,184,212,0.3)}
        .nx-comment-submit{
          padding:8px 16px;border-radius:8px;
          border:1px solid rgba(126,184,212,0.25);
          background:rgba(126,184,212,0.08);
          color:#7eb8d4;
          font-family:'JetBrains Mono',monospace;
          font-size:9px;letter-spacing:1px;text-transform:uppercase;
          cursor:pointer;transition:all 0.2s;
        }
        .nx-comment-submit:hover{background:rgba(126,184,212,0.14)}
        .nx-comment-list{display:flex;flex-direction:column;gap:8px}
        .nx-comment-item{
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:8px;padding:10px 12px;
        }
        .nx-comment-user{
          font-size:11px;font-weight:600;color:#d8dde8;margin-bottom:4px;
        }
        .nx-comment-text{
          font-size:11px;color:rgba(200,210,220,0.5);line-height:1.5;
        }
        .nx-comment-date{
          font-family:'JetBrains Mono',monospace;
          font-size:9px;color:rgba(200,210,220,0.2);margin-top:6px;
        }
        .nx-comment-delete{
          font-size:8px;color:rgba(220,80,90,0.5);
          cursor:pointer;transition:color 0.2s;
        }
        .nx-comment-delete:hover{color:rgba(220,80,90,0.8)}

        /* ── HISTORY ── */
        .nx-history{display:flex;flex-direction:column;gap:8px}
        .nx-hist-item{
          display:flex;justify-content:space-between;align-items:center;
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:12px;padding:14px 16px;
          transition:border-color 0.2s;
        }
        .nx-hist-item:hover{border-color:rgba(255,255,255,0.12)}
        .nx-hist-cat{
          font-size:13px;font-weight:600;
          color:#d8dde8;margin-bottom:3px;
        }
        .nx-hist-date{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;color:rgba(200,210,220,0.28);letter-spacing:0.5px;
        }
        .nx-hist-score{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;color:rgba(200,210,220,0.3);
          text-align:right;margin-bottom:3px;
        }
        .nx-hist-pts{
          font-size:15px;font-weight:700;
          color:#e6b84a;text-align:right;letter-spacing:-0.3px;
        }

        /* ── LEADERBOARD ── */
        .nx-lb{display:flex;flex-direction:column;gap:4px}
        .nx-lb-item{
          display:flex;align-items:center;gap:10px;
          padding:9px 10px;border-radius:9px;
          border:1px solid transparent;
          transition:all 0.2s;
        }
        .nx-lb-item:hover{background:rgba(255,255,255,0.03)}
        .nx-lb-item.gold{
          border-color:rgba(230,184,74,0.2);
          background:rgba(230,184,74,0.05);
        }
        .nx-lb-item.self{
          border-color:rgba(126,184,212,0.2);
          background:rgba(126,184,212,0.05);
        }
        .nx-lb-pos{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:500;
          color:rgba(200,210,220,0.25);min-width:22px;
        }
        .nx-lb-pos.gold{color:#e6b84a}
        .nx-lb-name{flex:1;font-size:13px;font-weight:500;color:#d8dde8}
        .nx-lb-you{
          font-family:'JetBrains Mono',monospace;
          font-size:8px;letter-spacing:1px;
          color:#7eb8d4;background:rgba(126,184,212,0.12);
          padding:2px 7px;border-radius:5px;margin-left:6px;
        }
        .nx-lb-score{
          font-size:13px;font-weight:700;
          color:#e6b84a;text-align:right;letter-spacing:-0.2px;
        }
        .nx-lb-rank{
          font-family:'JetBrains Mono',monospace;
          font-size:9px;letter-spacing:0.5px;
          color:rgba(200,210,220,0.25);text-align:right;margin-top:2px;
        }

        .nx-empty{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;letter-spacing:1.5px;
          color:rgba(200,210,220,0.2);
          text-align:center;padding:32px 0;
        }

        @media(max-width:860px){
          .nx-main{padding:14px}
          .nx-username{font-size:18px}
          .nx-avatar{width:50px;height:50px;font-size:24px}
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div className={`nx-sidebar ${open ? "open" : ""}`}>
        <div className="nx-sidebar-head">
          <span className="nx-logo">NEXUS</span>
          <button className="nx-menu-btn" onClick={() => setOpen(o => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="nx-nav">
          {NAV.map(({ icon: Icon, label, path }) => (
            <div
              key={path}
              className={`nx-nav-item ${location.pathname === path ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={18} />
              <span className="nx-nav-label">{label}</span>
            </div>
          ))}
          <div className="nx-nav-item nx-logout" onClick={logout}>
            <LogOut size={18} />
            <span className="nx-nav-label">Sign out</span>
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
              <div className="nx-username">{user?.username || "Unknown"}</div>
              <div className="nx-user-meta">
                <span>Lv {level}</span>
                <span className="nx-user-dot">·</span>
                <span style={{ color: rankMeta.color }}>{rankMeta.label}</span>
                <span className="nx-user-dot">·</span>
                <span>{totalScore.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          <div className="nx-topbar-right">
            <div className="nx-badge">
              {progress}% → {rankMeta.next || "MAX RANK"}
            </div>
            <div
              className="nx-rank-badge"
              style={{ color: rankMeta.color, borderColor: rankMeta.border, background: rankMeta.bg }}
            >
              {rankMeta.label.toUpperCase()}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="nx-stats">
          <div className="nx-stat" style={{ "--sc": rankMeta.color }}>
            <div className="nx-stat-label">Current Rank</div>
            <div className="nx-stat-val" style={{ color: rankMeta.color }}>{rankMeta.label}</div>
            {rankMeta.next ? (
              <>
                <div className="nx-prog-track">
                  <div
                    className="nx-prog-fill"
                    style={{ width: `${progress}%`, background: rankMeta.color }}
                  />
                </div>
                <div className="nx-stat-hint">
                  {progress}% · {(rankMeta.threshold - totalScore).toLocaleString()} pts to {rankMeta.next}
                </div>
              </>
            ) : (
              <div className="nx-stat-hint" style={{ color: rankMeta.color, marginTop: 8 }}>
                Max rank achieved
              </div>
            )}
          </div>
          <div className="nx-stat" style={{ "--sc": "#e6b84a" }}>
            <div className="nx-stat-label">Total Score</div>
            <div className="nx-stat-val">{totalScore.toLocaleString()}</div>
            <div className="nx-stat-hint">Cumulative XP</div>
          </div>
          <div className="nx-stat" style={{ "--sc": "#7eb8d4" }}>
            <div className="nx-stat-label">Sessions</div>
            <div className="nx-stat-val">{scores.length}</div>
            <div className="nx-stat-hint">Win rate {winRate}%</div>
          </div>
          <div className="nx-stat" style={{ "--sc": "#6aac7a" }}>
            <div className="nx-stat-label">Best Score</div>
            <div className="nx-stat-val">{bestScore.toLocaleString()}</div>
            <div className="nx-stat-hint">Personal record</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="nx-controls">
          <div className="nx-search-wrap">
            <span className="nx-search-icon">⌕</span>
            <input
              className="nx-search"
              placeholder="Search games…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="nx-tabs">
            <button
              className={`nx-tab ${activeTab === "games" ? "active" : ""}`}
              onClick={() => setActiveTab("games")}
            >Games</button>
            <button
              className={`nx-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >History</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="nx-content">
          <div className="nx-panel">

            {activeTab === "games" && (
              filtered.length === 0
                ? <p className="nx-empty">No games found</p>
                : <div className="nx-games">
                    {filtered.map(game => {
                      const s = CAT_META[game.category?.toUpperCase()] || CAT_META.QUIZ;
                      return (
                        <div
                          key={game.id}
                          className="nx-game-card"
                          style={{
                            "--gc":     s.color,
                            "--gc-bg":  s.bg,
                            "--gc-bg-h":s.bg.replace("0.1","0.18"),
                            "--gc-dim": s.border,
                          }}
                          onClick={() => handlePlay(game)}
                        >
                          <div
                            className="nx-game-icon"
                            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                          >{s.icon}</div>
                          <div
                            className="nx-game-cat"
                            style={{ color: s.color, borderColor: s.border, background: s.bg }}
                          >{s.label}</div>
                          <div className="nx-game-title">{game.title}</div>
                          <div className="nx-game-desc">{game.description}</div>
                          <div className="nx-game-actions">
                            <button
                              className={`nx-fav-btn ${isGameFavorited(game.id) ? "active" : ""}`}
                              onClick={e => { e.stopPropagation(); toggleFavorite(game.id); }}
                            >
                              <Heart size={16} fill={isGameFavorited(game.id) ? "currentColor" : "none"} />
                            </button>
                            <div className="nx-rating-stars">
                              {[1,2,3,4,5].map(star => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={`nx-star ${ratings[game.id] && star <= ratings[game.id] ? "filled" : ""}`}
                                  onClick={e => { e.stopPropagation(); addRating(game.id, star); }}
                                />
                              ))}
                            </div>
                            <div
                              className="nx-comment-toggle"
                              onClick={e => { e.stopPropagation(); toggleComments(game.id); }}
                            >
                              <MessageSquare size={12} />
                              {comments[game.id]?.length || 0}
                            </div>
                          </div>
                          <div className={`nx-comments-section ${showComments[game.id] ? "open" : ""}`}>
                            <div className="nx-comment-input-wrap">
                              <input
                                className="nx-comment-input"
                                placeholder="Add a comment…"
                                value={commentInput[game.id] || ""}
                                onChange={e => setCommentInput(prev => ({ ...prev, [game.id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter") addComment(game.id); }}
                              />
                              <button
                                className="nx-comment-submit"
                                onClick={e => { e.stopPropagation(); addComment(game.id); }}
                              >Post</button>
                            </div>
                            <div className="nx-comment-list">
                              {(comments[game.id] || []).filter(c => c && c.id).map(comment => (
                                <div key={comment.id} className="nx-comment-item">
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div className="nx-comment-user">{comment.user?.username || "Unknown"}</div>
                                    {comment.user?.username === user?.username && (
                                      <span
                                        className="nx-comment-delete"
                                        onClick={e => { e.stopPropagation(); deleteComment(comment.id, game.id); }}
                                      >Delete</span>
                                    )}
                                  </div>
                                  <div className="nx-comment-text">{comment.content}</div>
                                  <div className="nx-comment-date">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            className="nx-play-btn"
                            onClick={e => { e.stopPropagation(); handlePlay(game); }}
                          >Play</button>
                        </div>
                      );
                    })}
                  </div>
            )}

            {activeTab === "history" && (
              <div className="nx-history">
                {scores.length === 0
                  ? <p className="nx-empty">No sessions yet</p>
                  : [...scores].reverse().map((s, i) => (
                      <div key={i} className="nx-hist-item">
                        <div>
                          <div className="nx-hist-cat">{s.category || "Quiz"}</div>
                          <div className="nx-hist-date">
                            {s.endTime ? new Date(s.endTime).toLocaleDateString() : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="nx-hist-score">
                            {s.correctAnswers ?? "?"} / {s.totalQuestions ?? "?"} correct
                          </div>
                          <div className="nx-hist-pts">+{(s.points ?? s.score ?? 0).toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          {/* LEADERBOARD */}
          <div className="nx-side-panel">
            <div className="nx-panel-title">Leaderboard</div>
            <div className="nx-lb">
              {leaderboard.length === 0
                ? <p className="nx-empty">No data</p>
                : leaderboard.map((u, i) => (
                    <div
                      key={i}
                      className={`nx-lb-item ${i === 0 ? "gold" : ""} ${u.username === user?.username ? "self" : ""}`}
                    >
                      <span className={`nx-lb-pos ${i === 0 ? "gold" : ""}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="nx-lb-name">
                        {u.username}
                        {u.username === user?.username && <span className="nx-lb-you">you</span>}
                      </span>
                      <div>
                        <div className="nx-lb-score">{(u.totalScore ?? 0).toLocaleString()}</div>
                        <div className="nx-lb-rank">{u.rank || u.badge || "Bronze"}</div>
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