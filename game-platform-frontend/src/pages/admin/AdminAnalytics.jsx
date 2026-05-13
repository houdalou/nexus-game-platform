import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Gamepad2,
  Trophy,
  BarChart3,
  Activity,
  Star,
} from "lucide-react";

import statsService from "../../services/statsService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const COLORS = ["#00f0ff", "#a855f7", "#ff2bd6", "#ff6b35", "#00ff9d"];

/* ─── ROLE HELPERS (same logic as AdminUsers) ─── */
const isAdmin = (u) =>
  u?.role === "ADMIN" || u?.role === "ROLE_ADMIN";

const isPlayer = (u) => !isAdmin(u);

export default function AdminAnalytics() {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await statsService.getGlobal();
      setRawData(res.data);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to load analytics" });
    } finally {
      setLoading(false);
    }
  };

  /* ─── DERIVED STATS (same useMemo pattern as AdminUsers.filteredUsers) ─── */
  const stats = useMemo(() => {
    if (!rawData) return null;

    // 1. Build the full user list — try every known key the backend might use
    const usersList = rawData.users || rawData.allUsers || [];

    // 2. Players only (strips admins just like AdminUsers does)
    const players = Array.isArray(usersList) ? usersList.filter(isPlayer) : [];

    // 3. Active players
    const activeUsersList = Array.isArray(rawData.activeUsersList)
      ? rawData.activeUsersList.filter(isPlayer)
      : [];

    // 4. Top players — keep only non-admins; preserve backend order
    const topPlayers = Array.isArray(rawData.topPlayers)
      ? rawData.topPlayers.filter(isPlayer)
      : [];

    return {
      ...rawData,

      // Prefer computed count from array; fall back to whatever the backend sent
      totalUsers:
        players.length > 0
          ? players.length
          : rawData.totalUsers ?? rawData.playerCount ?? 0,

      activeUsers:
        activeUsersList.length > 0
          ? activeUsersList.length
          : rawData.activeUsers ?? 0,

      topPlayers,
    };
  }, [rawData]);

  return (
    <AdminLayout>
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--pink)",
            margin: "0 0 24px",
          }}
        >
          ANALYTICS (PLAYERS ONLY)
        </h1>

        {loading || !stats ? (
          <LoadingSpinner />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* STATS CARDS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                icon={Users}
                label="Total Players"
                value={stats.totalUsers}
                color="var(--cyan)"
              />
              <StatCard
                icon={Activity}
                label="Active Players"
                value={stats.activeUsers}
                color="var(--green)"
              />
              <StatCard
                icon={Gamepad2}
                label="Total Games"
                value={stats.totalGames ?? 0}
                color="var(--pink)"
              />
              <StatCard
                icon={BarChart3}
                label="Total Scores"
                value={stats.totalScores ?? 0}
                color="#a855f7"
              />
              <StatCard
                icon={Star}
                label="Avg Score"
                value={stats.averageScore?.toFixed(1) ?? "0.0"}
                color="#ff6b35"
              />
            </div>

            {/* TOP PLAYERS */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-dim)",
                borderRadius: "var(--radius)",
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  letterSpacing: 2,
                  color: "var(--text-dim)",
                  margin: "0 0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Trophy size={16} color="var(--pink)" />
                TOP PLAYERS
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.topPlayers.length > 0 ? (
                  stats.topPlayers.map((p, i) => (
                    <PlayerRow key={p.id ?? i} player={p} rank={i} />
                  ))
                ) : (
                  <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
                    No players found
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ─── PLAYER ROW ─── */
function PlayerRow({ player: p, rank: i }) {
  /* Avatar: prefer real URL, fall back to DiceBear (v9) */
  const avatarSrc =
    p.avatarUrl ||
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(p.username)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        background: i === 0 ? "rgba(255,43,214,0.06)" : "rgba(0,0,0,0.2)",
        border:
          i === 0
            ? "1px solid rgba(255,43,214,0.2)"
            : "1px solid var(--border-dim)",
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: i < 3 ? COLORS[i] : "var(--border-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          color: "#000",
          flexShrink: 0,
        }}
      >
        {i + 1}
      </div>

      {/* Avatar */}
      <img
        src={avatarSrc}
        alt=""
        onError={(e) => {
          // If the real avatarUrl is broken, fall back to DiceBear
          e.currentTarget.src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(p.username)}`;
        }}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--border-dim)",
          flexShrink: 0,
        }}
      />

      {/* Name / level */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.username}</div>
        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
          LV.{p.level || 1}
          {p.badge ? ` • ${p.badge}` : ""}
        </div>
      </div>

      {/* Score */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, color: "var(--cyan)", fontSize: 14 }}>
          {p.totalScore ?? 0}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-dim)" }}>SCORE</div>
      </div>
    </motion.div>
  );
}

/* ─── STATS CARD ─── */
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={16} color={color} />
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-display)",
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </motion.div>
  );
}