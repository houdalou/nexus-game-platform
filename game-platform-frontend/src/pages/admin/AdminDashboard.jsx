import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Gamepad2, Trophy, BarChart3, Activity, Star } from "lucide-react";
import statsService from "../../services/statsService";
import gameService from "../../services/gameService";
import userService from "../../services/userService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const STAT_COLORS = {
  users: "var(--cyan)",
  games: "var(--pink)",
  scores: "#a855f7",
  avg: "#ff6b35",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, g, u] = await Promise.all([
        statsService.getGlobal(),
        gameService.getAllAdmin(),
        userService.getAll(),
      ]);
      setStats(s.data);
      setGames(g.data);
      setUsers(u.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopPlayers = stats?.topPlayers?.filter(p => p.role !== "ADMIN" && p.role !== "ROLE_ADMIN") || [];
  const filteredRecentUsers = users.filter(u => u.role !== "ADMIN" && u.role !== "ROLE_ADMIN");

  return (
    <AdminLayout>
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--pink)", margin: "0 0 8px" }}>
          DASHBOARD
        </h1>
        <p style={{ margin: "0 0 24px", color: "var(--text-dim)", fontSize: 13 }}>
          Platform overview and key metrics
        </p>

        {loading || !stats ? (
          <LoadingSpinner />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color={STAT_COLORS.users} />
              <StatCard icon={Activity} label="Active Users" value={stats.activeUsers} color="var(--green)" />
              <StatCard icon={Gamepad2} label="Games" value={stats.totalGames} color={STAT_COLORS.games} />
              <StatCard icon={BarChart3} label="Scores" value={stats.totalScores} color={STAT_COLORS.scores} />
              <StatCard icon={Star} label="Avg Score" value={stats.averageScore.toFixed(1)} color={STAT_COLORS.avg} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {/* Top Players */}
              <Panel title="TOP PLAYERS" icon={Trophy} color="var(--pink)">
                {filteredTopPlayers.length > 0 ? (
                  filteredTopPlayers.slice(0, 5).map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-dim)" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: i < 3 ? STAT_COLORS.scores : "var(--text-dim)", width: 16 }}>{i + 1}</span>
                      <img src={p.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${p.username}`} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border-dim)" }} />
                      <span style={{ flex: 1, fontSize: 13 }}>{p.username}</span>
                      <span style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600 }}>{p.totalScore || 0}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-dim)", fontSize: 13 }}>No players yet</p>
                )}
              </Panel>

              {/* Recent Games */}
              <Panel title="GAMES" icon={Gamepad2} color="var(--cyan)">
                {games.length > 0 ? (
                  games.slice(0, 5).map((g) => (
                    <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-dim)" }}>
                      <span style={{ fontSize: 13 }}>{g.title}</span>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 1, color: "var(--text-dim)", textTransform: "uppercase" }}>
                        {g.enabled !== false ? "ON" : "OFF"} &bull; {g.category || "ARCADE"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-dim)", fontSize: 13 }}>No games yet</p>
                )}
              </Panel>

              {/* Recent Users */}
              <Panel title="RECENT USERS" icon={Users} color="var(--green)">
                {filteredRecentUsers.length > 0 ? (
                  filteredRecentUsers.slice(0, 5).map((u) => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-dim)" }}>
                      <img src={u.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.username}`} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border-dim)" }} />
                      <span style={{ flex: 1, fontSize: 13 }}>{u.username}</span>
                      <span style={{ fontSize: 11, color: u.banned ? "var(--pink)" : "var(--text-dim)" }}>
                        {u.banned ? "BANNED" : u.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-dim)", fontSize: 13 }}>No users yet</p>
                )}
              </Panel>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: "var(--radius)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)" }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </motion.div>
  );
}

function Panel({ title, icon: Icon, color, children }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-dim)", borderRadius: "var(--radius)", padding: 20 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 12, letterSpacing: 2, color: "var(--text-dim)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={14} color={color} /> {title}
      </h3>
      {children}
    </div>
  );
}