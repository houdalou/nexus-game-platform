import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Lock, Star, Zap, Trophy, Flame, Target, Crown } from "lucide-react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const ALL_ACHIEVEMENTS = [
  { id: "first_game", title: "First Blood", desc: "Play your first game", icon: Zap, req: (u) => (u?.totalScore || 0) > 0, color: "#00f0ff" },
  { id: "score_100", title: "Centurion", desc: "Reach 100 total score", icon: Star, req: (u) => (u?.totalScore || 0) >= 100, color: "#d4a84b" },
  { id: "score_500", title: "High Roller", desc: "Reach 500 total score", icon: Trophy, req: (u) => (u?.totalScore || 0) >= 500, color: "#ff6b35" },
  { id: "score_1000", title: "Legend", desc: "Reach 1000 total score", icon: Crown, req: (u) => (u?.totalScore || 0) >= 1000, color: "#a855f7" },
  { id: "level_5", title: "Rising Star", desc: "Reach level 5", icon: Flame, req: (u) => (u?.level || 0) >= 5, color: "#ff2bd6" },
  { id: "level_10", title: "Veteran", desc: "Reach level 10", icon: Target, req: (u) => (u?.level || 0) >= 10, color: "#00ff9d" },
  { id: "silver", title: "Silver Surfer", desc: "Achieve Silver rank", icon: Star, req: (u) => ["SILVER", "GOLD", "PLATINUM", "DIAMOND"].includes(u?.badge), color: "#9ba8b4" },
  { id: "gold", title: "Golden Child", desc: "Achieve Gold rank", icon: Trophy, req: (u) => ["GOLD", "PLATINUM", "DIAMOND"].includes(u?.badge), color: "#d4a84b" },
  { id: "diamond", title: "Diamond Hands", desc: "Achieve Diamond rank", icon: Crown, req: (u) => u?.badge === "DIAMOND", color: "#7eb8d4" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function Achievements() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unlocked = ALL_ACHIEVEMENTS.filter((a) => a.req(user));
  const locked = ALL_ACHIEVEMENTS.filter((a) => !a.req(user));

  return (
    <Layout>
      <div className="achievements-page">
        <style>{`
          .achievements-page { animation: fadeIn 0.5s ease; }
          .achievements-header { margin-bottom:32px; }
          .achievements-title { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--cyan); margin:0 0 8px; text-shadow:0 0 20px rgba(0,240,255,0.15); }
          .achievements-sub { color:var(--text-dim); font-size:13px; margin:0; }
          .achievements-summary { display:flex; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
          .summary-card {
            background:var(--bg-card); border:1px solid var(--border-dim);
            border-radius:var(--radius); padding:20px 28px; min-width:160px;
            backdrop-filter:blur(14px);
          }
          .summary-value { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--amber); margin:0 0 4px; }
          .summary-label { font-size:11px; color:var(--text-dim); font-family:var(--font-display); letter-spacing:2px; }
          .achievements-grid {
            display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));
            gap:16px;
          }
          .achievement-card {
            background:var(--bg-card); border:1px solid var(--border-dim);
            border-radius:var(--radius); padding:24px; position:relative;
            overflow:hidden; transition:all 0.3s ease;
            backdrop-filter:blur(14px);
          }
          .achievement-card::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
            opacity:0; transition:opacity 0.3s;
          }
          .achievement-card.unlocked:hover {
            transform:translateY(-4px); border-color:var(--border);
            box-shadow:var(--glow-cyan);
          }
          .achievement-card.unlocked:hover::before { opacity:1; }
          .achievement-card.locked { opacity:0.5; }
          .achievement-icon {
            width:48px; height:48px; border-radius:12px;
            display:flex; align-items:center; justify-content:center;
            margin-bottom:14px;
          }
          .achievement-title { font-family:var(--font-display); font-size:14px; font-weight:600; color:var(--text); margin:0 0 6px; }
          .achievement-desc { font-size:12px; color:var(--text-dim); margin:0 0 12px; }
          .achievement-status {
            display:inline-flex; align-items:center; gap:4px;
            font-size:10px; font-family:var(--font-display); letter-spacing:1px;
            padding:4px 10px; border-radius:6px;
          }
          .locked-badge {
            position:absolute; top:12px; right:12px;
            color:var(--text-dim);
          }
          .section-title-sm {
            font-family:var(--font-display); font-size:14px; color:var(--text); margin:0 0 20px; letter-spacing:2px;
          }
          .empty-achievements { text-align:center; padding:40px; color:var(--text-dim); }
        `}</style>

        <div className="achievements-header">
          <h1 className="achievements-title">ACHIEVEMENTS</h1>
          <p className="achievements-sub">// UNLOCK LEGENDARY BADGES</p>
        </div>

        <div className="achievements-summary">
          <div className="summary-card">
            <p className="summary-value">{unlocked.length}</p>
            <p className="summary-label">UNLOCKED</p>
          </div>
          <div className="summary-card">
            <p className="summary-value">{locked.length}</p>
            <p className="summary-label">LOCKED</p>
          </div>
          <div className="summary-card">
            <p className="summary-value">{Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100)}%</p>
            <p className="summary-label">COMPLETION</p>
          </div>
        </div>

        <h3 className="section-title-sm">// UNLOCKED</h3>
        {unlocked.length === 0 && !loading ? (
          <div className="empty-achievements">Start playing to unlock achievements!</div>
        ) : (
          <motion.div
            className="achievements-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 40 }}
          >
            {unlocked.map((a) => (
              <motion.div key={a.id} className="achievement-card unlocked" variants={itemVariants}>
                <div className="achievement-icon" style={{ background: `${a.color}15`, border: `1px solid ${a.color}40`, color: a.color }}>
                  <a.icon size={22} />
                </div>
                <h4 className="achievement-title">{a.title}</h4>
                <p className="achievement-desc">{a.desc}</p>
                <span className="achievement-status" style={{ background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30` }}>
                  <Award size={12} /> UNLOCKED
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <h3 className="section-title-sm">// LOCKED</h3>
        <motion.div
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {locked.map((a) => (
            <motion.div key={a.id} className="achievement-card locked" variants={itemVariants}>
              <div className="locked-badge"><Lock size={16} /></div>
              <div className="achievement-icon" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-dim)", color: "var(--text-dim)" }}>
                <a.icon size={22} />
              </div>
              <h4 className="achievement-title">{a.title}</h4>
              <p className="achievement-desc">{a.desc}</p>
              <span className="achievement-status" style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-dim)", border: "1px solid var(--border-dim)" }}>
                LOCKED
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
