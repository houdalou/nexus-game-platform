import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Star, Trophy, Gamepad2, TrendingUp, Award } from "lucide-react";
import userService from "../../services/userService";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const RANK_META = {
  BRONZE: { emoji: "🥉", color: "#c97c3a", next: "SILVER", threshold: 100 },
  SILVER: { emoji: "🥈", color: "#9ba8b4", next: "GOLD", threshold: 300 },
  GOLD: { emoji: "🥇", color: "#d4a84b", next: "PLATINUM", threshold: 600 },
  PLATINUM: { emoji: "💎", color: "#b8c4cc", next: "DIAMOND", threshold: 1000 },
  DIAMOND: { emoji: "👑", color: "#7eb8d4", next: null, threshold: null },
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getMe(),
      api.get("/quiz/sessions/me").catch(() => ({ data: [] })),
    ])
      .then(([userRes, scoresRes]) => {
        setUser(userRes.data);
        setScores(scoresRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <div style={{ width: 40, height: 40, border: "2px solid var(--border-dim)", borderTopColor: "var(--cyan)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </Layout>
    );
  }

  const rank = user?.badge || "BRONZE";
  const meta = RANK_META[rank] || RANK_META.BRONZE;
  const nextThreshold = meta.threshold || (user?.xp || 0);
  const xpProgress = nextThreshold > 0 ? Math.min(100, Math.round(((user?.xp || 0) / nextThreshold) * 100)) : 100;
  const bestScore = scores.length > 0 ? Math.max(...scores.map((s) => s.points ?? s.score ?? 0)) : 0;

  return (
    <Layout>
      <div className="profile-page">
        <style>{`
          .profile-page { animation: fadeIn 0.5s ease; }
          .profile-header { margin-bottom:32px; }
          .profile-title { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--cyan); margin:0 0 8px; text-shadow:0 0 20px rgba(0,240,255,0.15); }
          .profile-sub { color:var(--text-dim); font-size:13px; margin:0; }
          .profile-card {
            background:var(--bg-card); border:1px solid var(--border-dim);
            border-radius:var(--radius); padding:32px; margin-bottom:24px;
            backdrop-filter:blur(14px); position:relative; overflow:hidden;
          }
          .profile-card::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
            opacity:0.7;
          }
          .profile-top { display:flex; gap:24px; align-items:center; margin-bottom:24px; flex-wrap:wrap; }
          .profile-avatar-large {
            width:96px; height:96px; border-radius:50%;
            background: linear-gradient(135deg, rgba(0,240,255,0.2), rgba(168,85,247,0.2));
            border:2px solid rgba(0,240,255,0.3);
            display:flex; align-items:center; justify-content:center;
            font-size:48px; box-shadow:0 0 30px rgba(0,240,255,0.15);
            flex-shrink:0;
          }
          .profile-info { flex:1; }
          .profile-name { font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--text); margin:0 0 4px; }
          .profile-role { font-size:12px; color:var(--text-dim); font-family:var(--font-display); letter-spacing:2px; }
          .profile-stats-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-bottom:24px; }
          .profile-stat {
            background:rgba(255,255,255,0.02); border:1px solid var(--border-dim);
            border-radius:10px; padding:16px; text-align:center;
          }
          .profile-stat-value {
            font-family:var(--font-display); font-size:22px; font-weight:700;
            color:var(--amber); margin:0 0 4px;
          }
          .profile-stat-label {
            font-size:10px; color:var(--text-dim); font-family:var(--font-display); letter-spacing:2px;
          }
          .xp-bar { margin-bottom:24px; }
          .xp-bar-label { display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px; }
          .xp-track { height:6px; background:rgba(255,255,255,0.05); border-radius:999px; overflow:hidden; }
          .xp-fill { height:100%; border-radius:999px; background:linear-gradient(90deg, var(--cyan), var(--purple)); transition:width 0.8s ease; }
          .section-title-sm {
            font-family:var(--font-display); font-size:14px; color:var(--text); margin:0 0 16px; letter-spacing:2px;
          }
          .detail-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-dim); }
          .detail-row:last-child { border-bottom:none; }
          .detail-icon { width:36px; height:36px; border-radius:8px; background:rgba(0,240,255,0.06); display:flex; align-items:center; justify-content:center; color:var(--cyan); flex-shrink:0; }
          .detail-text { font-size:13px; color:var(--text-dim); }
          .detail-text strong { color:var(--text); }
          .history-list { display:flex; flex-direction:column; gap:8px; }
          .history-item {
            display:flex; justify-content:space-between; align-items:center;
            padding:12px 16px; border-radius:10px; background:rgba(255,255,255,0.02);
            border:1px solid var(--border-dim); transition:all 0.2s;
          }
          .history-item:hover { border-color:var(--border); transform:translateX(2px); }
        `}</style>

        <div className="profile-header">
          <h1 className="profile-title">PROFILE</h1>
          <p className="profile-sub">// OPERATOR DATA</p>
        </div>

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar-large">{user?.avatarUrl || "🎮"}</div>
            <div className="profile-info">
              <h2 className="profile-name">{user?.username}</h2>
              <p className="profile-role">{user?.role?.replace("ROLE_", "") || "USER"}</p>
            </div>
          </div>

          <div className="profile-stats-row">
            <div className="profile-stat">
              <p className="profile-stat-value">{user?.level || 1}</p>
              <p className="profile-stat-label">LEVEL</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-value">{user?.xp || 0}</p>
              <p className="profile-stat-label">TOTAL XP</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-value">{user?.totalScore || 0}</p>
              <p className="profile-stat-label">SCORE</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-value">{scores.length}</p>
              <p className="profile-stat-label">SESSIONS</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-value">{bestScore}</p>
              <p className="profile-stat-label">BEST</p>
            </div>
          </div>

          <div className="xp-bar">
            <div className="xp-bar-label">
              <span style={{ color: "var(--cyan)", fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2 }}>XP PROGRESS</span>
              <span style={{ color: "var(--text-dim)" }}>{user?.xp || 0} / {meta.next ? nextThreshold : "MAX"} XP</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6, fontFamily: "var(--font-display)", letterSpacing: 1 }}>
              {meta.next ? `${xpProgress}% TO ${meta.next}` : "MAXIMUM RANK ACHIEVED"}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          <div className="profile-card">
            <h3 className="section-title-sm">// ACCOUNT INFO</h3>
            <div className="detail-row">
              <div className="detail-icon"><User size={16} /></div>
              <span className="detail-text"><strong>Username:</strong> {user?.username}</span>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><Mail size={16} /></div>
              <span className="detail-text"><strong>Email:</strong> {user?.email || "Not set"}</span>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><Shield size={16} /></div>
              <span className="detail-text"><strong>Role:</strong> {user?.role?.replace("ROLE_", "") || "USER"}</span>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><Star size={16} /></div>
              <span className="detail-text"><strong>Rank:</strong> {meta.emoji} {rank}</span>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="section-title-sm">// RECENT ACTIVITY</h3>
            <div className="history-list">
              {scores.length === 0 ? (
                <p style={{ color: "var(--text-dim)", fontSize: 13, textAlign: "center", padding: 20 }}>No recent activity</p>
              ) : (
                scores.slice(0, 5).map((s, i) => (
                  <div key={i} className="history-item">
                    <div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{s.category || "QUIZ"}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-dim)" }}>
                        {s.endTime ? new Date(s.endTime).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--amber)", fontFamily: "var(--font-display)" }}>+{s.points ?? s.score ?? 0} PTS</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
