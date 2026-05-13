import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star } from "lucide-react";
import scoreService from "../../services/scoreService";
import userService from "../../services/userService";
import Layout from "../../components/Layout";

const FILTERS = [
  { key: "global", label: "GLOBAL" },
  { key: "weekly", label: "WEEKLY" },
  { key: "monthly", label: "MONTHLY" },
];

const RANK_META = {
  BRONZE: { emoji: "🥉", color: "#c97c3a" },
  SILVER: { emoji: "🥈", color: "#9ba8b4" },
  GOLD: { emoji: "🥇", color: "#d4a84b" },
  PLATINUM: { emoji: "💎", color: "#b8c4cc" },
  DIAMOND: { emoji: "👑", color: "#7eb8d4" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function Rankings() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState("global");
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      scoreService.getLeaderboard(),
      userService.getMe().catch(() => null),
    ])
      .then(([lbRes, meRes]) => {
        setLeaderboard(lbRes.data.filter(p => p.role !== "ADMIN" && p.role !== "ROLE_ADMIN"));
        if (meRes) setMe(meRes.data);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getRankStyle = (rank) => {
    if (rank === 1) return { background: "rgba(212,168,75,0.08)", border: "1px solid rgba(212,168,75,0.3)", color: "#d4a84b" };
    if (rank === 2) return { background: "rgba(156,168,180,0.08)", border: "1px solid rgba(156,168,180,0.3)", color: "#9ca8b4" };
    if (rank === 3) return { background: "rgba(192,128,80,0.08)", border: "1px solid rgba(192,128,80,0.3)", color: "#c08050" };
    return { background: "transparent", border: "1px solid var(--border-dim)", color: "var(--text-dim)" };
  };

  return (
    <Layout>
      <div className="rankings-page">
        <style>{`
          .rankings-page { animation: fadeIn 0.5s ease; }
          .rankings-header { margin-bottom:32px; }
          .rankings-title { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--cyan); margin:0 0 8px; text-shadow:0 0 20px rgba(0,240,255,0.15); }
          .rankings-sub { color:var(--text-dim); font-size:13px; margin:0; }
          .filter-tabs { display:flex; gap:8px; margin-bottom:32px; }
          .filter-tab {
            padding:8px 18px; border-radius:8px; border:1px solid var(--border-dim);
            background:var(--bg-card); color:var(--text-dim); font-size:11px;
            font-family:var(--font-display); letter-spacing:2px; cursor:pointer;
            transition:all 0.2s; text-transform:uppercase;
          }
          .filter-tab:hover { border-color:var(--border); color:var(--text); }
          .filter-tab.active { border-color:var(--cyan); color:var(--cyan); background:rgba(0,240,255,0.06); box-shadow:0 0 12px rgba(0,240,255,0.08); }
          .podium { display:flex; justify-content:center; align-items:flex-end; gap:16px; margin-bottom:40px; flex-wrap:wrap; }
          .podium-card {
            background:var(--bg-card); border-radius:var(--radius); padding:24px;
            text-align:center; position:relative; overflow:hidden; transition:all 0.3s;
            backdrop-filter:blur(14px); min-width:180px;
          }
          .podium-card.rank-1 { border:1px solid rgba(212,168,75,0.3); box-shadow:0 0 30px rgba(212,168,75,0.1); order:2; transform:scale(1.08); }
          .podium-card.rank-2 { border:1px solid rgba(156,168,180,0.25); box-shadow:0 0 20px rgba(156,168,180,0.06); order:1; }
          .podium-card.rank-3 { border:1px solid rgba(192,128,80,0.25); box-shadow:0 0 20px rgba(192,128,80,0.06); order:3; }
          .podium-avatar {
            width:64px; height:64px; border-radius:50%;
            background: linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15));
            border:2px solid var(--border-dim);
            display:flex; align-items:center; justify-content:center;
            font-size:28px; margin:0 auto 12px;
          }
          .podium-name { font-family:var(--font-display); font-size:14px; font-weight:600; color:var(--text); margin:0 0 4px; }
          .podium-score { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--amber); margin:0 0 4px; }
          .podium-rank { font-size:11px; font-family:var(--font-display); letter-spacing:2px; }
          .leaderboard-table { max-width:800px; margin:0 auto; }
          .leaderboard-row {
            display:flex; align-items:center; gap:12px;
            padding:12px 16px; border-radius:10px; margin-bottom:6px;
            transition:all 0.2s;
          }
          .leaderboard-row:hover { transform:translateX(4px); }
          .leaderboard-row.self { background:rgba(0,240,255,0.04); border:1px solid rgba(0,240,255,0.15) !important; }
          .lb-rank {
            width:36px; height:36px; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            font-family:var(--font-display); font-size:12px; font-weight:700;
            flex-shrink:0;
          }
          .lb-avatar {
            width:40px; height:40px; border-radius:50%;
            background: linear-gradient(135deg, rgba(0,240,255,0.1), rgba(168,85,247,0.1));
            border:1px solid var(--border-dim);
            display:flex; align-items:center; justify-content:center;
            font-size:18px; flex-shrink:0;
          }
          .lb-info { flex:1; min-width:0; }
          .lb-name { font-size:14px; font-weight:600; color:var(--text); margin:0 0 2px; display:flex; align-items:center; gap:6px; }
          .lb-badge {
            font-size:9px; font-family:var(--font-display); letter-spacing:1px;
            padding:2px 8px; border-radius:999px;
          }
          .lb-level { font-size:11px; color:var(--text-dim); font-family:var(--font-display); }
          .lb-score { font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--amber); text-align:right; }
          .lb-xp { font-size:11px; color:var(--text-dim); text-align:right; }
          .empty-rankings { text-align:center; padding:80px 20px; color:var(--text-dim); }
          .loading-rankings { display:flex; justify-content:center; padding:80px; }
        `}</style>

        <div className="rankings-header">
          <h1 className="rankings-title">LEADERBOARD</h1>
          <p className="rankings-sub">// GLOBAL RANKINGS</p>
        </div>

        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-rankings">
            <div style={{ width: 40, height: 40, border: "2px solid var(--border-dim)", borderTopColor: "var(--cyan)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* PODIUM */}
            {top3.length > 0 && (
              <div className="podium">
                {top3.map((u, i) => {
                  const rank = i + 1;
                  const colors = rank === 1 ? "#d4a84b" : rank === 2 ? "#9ca8b4" : "#c08050";
                  return (
                    <motion.div
                      key={u.id || i}
                      className={`podium-card rank-${rank}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                    >
                      <div className="podium-avatar">{u.avatarUrl || "🎮"}</div>
                      <p className="podium-name">{u.username}</p>
                      <p className="podium-score">{u.totalScore || 0}</p>
                      <p className="podium-rank" style={{ color: colors }}>
                        {rank === 1 ? <><Crown size={14} style={{ verticalAlign: "middle" }} /> CHAMPION</> :
                         rank === 2 ? <><Medal size={14} style={{ verticalAlign: "middle" }} /> RUNNER-UP</> :
                         <><Star size={14} style={{ verticalAlign: "middle" }} /> THIRD PLACE</>}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* TABLE */}
            <motion.div
              className="leaderboard-table"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {rest.map((u, i) => {
                const rank = i + 4;
                const rankStyle = getRankStyle(rank);
                const badgeMeta = RANK_META[u.badge || "BRONZE"] || RANK_META.BRONZE;
                const isSelf = me && u.username === me.username;
                return (
                  <motion.div
                    key={u.id || i}
                    className={`leaderboard-row ${isSelf ? "self" : ""}`}
                    variants={itemVariants}
                    style={{ border: rankStyle.border, background: isSelf ? undefined : rankStyle.background }}
                  >
                    <div className="lb-rank" style={{ border: rankStyle.border, color: rankStyle.color }}>
                      {rank}
                    </div>
                    <div className="lb-avatar">{u.avatarUrl || "🎮"}</div>
                    <div className="lb-info">
                      <p className="lb-name">
                        {u.username}
                        <span className="lb-badge" style={{ background: `${badgeMeta.color}15`, color: badgeMeta.color, border: `1px solid ${badgeMeta.color}40` }}>
                          {badgeMeta.emoji} {u.badge || "BRONZE"}
                        </span>
                        {isSelf && <span style={{ fontSize: 9, fontFamily: "var(--font-display)", color: "var(--cyan)", background: "rgba(0,240,255,0.1)", padding: "2px 8px", borderRadius: 999 }}>YOU</span>}
                      </p>
                      <p className="lb-level">LV.{u.level || 1}</p>
                    </div>
                    <div>
                      <p className="lb-score">{u.totalScore || 0}</p>
                      <p className="lb-xp">{u.xp || 0} XP</p>
                    </div>
                  </motion.div>
                );
              })}
              {leaderboard.length === 0 && (
                <div className="empty-rankings">
                  <Trophy size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <p>No rankings data available yet.</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
}
