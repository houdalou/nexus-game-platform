import { useEffect, useState } from "react";
import {
  Users,
  Gamepad2,
  Trophy,
  BarChart3,
  Activity,
  Star,
} from "lucide-react";

import statsService from "../../services/statsService";
import gameService from "../../services/gameService";
import userService from "../../services/userService";

import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const getAvatar = (user) => {
    if (
      user?.avatarUrl &&
      user.avatarUrl.trim() !== ""
    ) {
      return user.avatarUrl;
    }

    return `https://api.dicebear.com/7.x/adventurer/png?seed=${user.username}`;
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const [s, g, u] = await Promise.all([
        statsService.getGlobal(),
        gameService.getAllAdmin(),
        userService.getAll(),
      ]);

      // REMOVE ADMINS
      const players = (u.data || []).filter(
        (user) =>
          user.role !== "ADMIN" &&
          user.role !== "ROLE_ADMIN"
      );

      // TOP PLAYERS WITHOUT ADMINS
      const topPlayers =
        (s.data?.topPlayers || []).filter(
          (p) =>
            p.role !== "ADMIN" &&
            p.role !== "ROLE_ADMIN"
        );

      // REBUILD STATS USING PLAYERS ONLY
      const fixedStats = {
        ...s.data,

        totalUsers: players.length,

        activeUsers: players.filter(
          (u) => !u.banned
        ).length,

        topPlayers,
      };

      setStats(fixedStats);
      setGames(g.data || []);
      setUsers(players);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const STAT_DEFS = [
    {
      key: "totalUsers",
      label: "Total players",
      icon: Users,
      color: "#7eb8d4",
    },
    {
      key: "activeUsers",
      label: "Active players",
      icon: Activity,
      color: "#6aac7a",
    },
    {
      key: "totalGames",
      label: "Games",
      icon: Gamepad2,
      color: "#a78bfa",
    },
    {
      key: "totalScores",
      label: "Scores",
      icon: BarChart3,
      color: "#e6b84a",
    },
    {
      key: "averageScore",
      label: "Avg score",
      icon: Star,
      color: "#e05c68",
      toFixed: 1,
    },
  ];

  const topPlayers = stats?.topPlayers || [];
  const recentUsers = users || [];

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .adm-page-title{
          font-size:22px;
          font-weight:700;
          color:#d8dde8;
          letter-spacing:-0.4px;
          margin-bottom:4px;
        }

        .adm-page-sub{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;
          letter-spacing:1.5px;
          color:rgba(200,210,220,0.3);
          margin-bottom:28px;
        }

        .adm-stat-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
          gap:12px;
          margin-bottom:24px;
        }

        .adm-stat{
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;
          padding:18px 20px;
          position:relative;
          overflow:hidden;
          transition:border-color 0.2s,transform 0.2s;
        }

        .adm-stat:hover{
          border-color:rgba(255,255,255,0.13);
          transform:translateY(-1px)
        }

        .adm-stat::before{
          content:'';
          position:absolute;
          top:0;
          left:20%;
          right:20%;
          height:1px;
          background:var(--sc);
          opacity:0.55;
        }

        .adm-stat-head{
          display:flex;
          align-items:center;
          gap:7px;
          margin-bottom:12px;
        }

        .adm-stat-label{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;
          letter-spacing:1.5px;
          color:rgba(200,210,220,0.3);
          text-transform:uppercase;
        }

        .adm-stat-val{
          font-size:26px;
          font-weight:700;
          color:var(--sc);
          letter-spacing:-0.5px;
          line-height:1;
        }

        .adm-panels{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:16px;
        }

        .adm-panel{
          background:rgba(10,13,24,0.9);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;
          padding:18px 20px;
          position:relative;
          overflow:hidden;
        }

        .adm-panel::after{
          content:'';
          position:absolute;
          top:0;
          left:15%;
          right:15%;
          height:1px;
          background:linear-gradient(
            90deg,
            transparent,
            var(--pc,rgba(126,184,212,0.35)),
            transparent
          );
        }

        .adm-panel-title{
          display:flex;
          align-items:center;
          gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:10px;
          letter-spacing:2px;
          text-transform:uppercase;
          color:rgba(200,210,220,0.3);
          margin-bottom:16px;
        }

        .adm-row{
          display:flex;
          align-items:center;
          gap:10px;
          padding:9px 0;
          border-bottom:1px solid rgba(255,255,255,0.05);
        }

        .adm-row:last-child{
          border-bottom:none
        }

        .adm-row-rank{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;
          font-weight:500;
          color:rgba(200,210,220,0.25);
          min-width:20px;
        }

        .adm-row-rank.top{
          color:#e6b84a
        }

        .adm-avatar{
          width:28px;
          height:28px;
          border-radius:50%;
          border:1px solid rgba(255,255,255,0.08);
          object-fit:cover;
          flex-shrink:0;
        }

        .adm-row-name{
          flex:1;
          font-size:13px;
          font-weight:500;
          color:#d8dde8;
        }

        .adm-row-val{
          font-family:'JetBrains Mono',monospace;
          font-size:12px;
          font-weight:500;
          color:#7eb8d4;
        }

        .adm-pill{
          font-family:'JetBrains Mono',monospace;
          font-size:9px;
          letter-spacing:1px;
          padding:3px 8px;
          border-radius:6px;
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(200,210,220,0.35);
          text-transform:uppercase;
        }

        .adm-pill.banned{
          border-color:rgba(224,92,104,0.3);
          color:#e05c68;
          background:rgba(224,92,104,0.08)
        }

        .adm-pill.on{
          border-color:rgba(106,172,122,0.3);
          color:#6aac7a;
          background:rgba(106,172,122,0.08)
        }

        .adm-empty{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;
          letter-spacing:1.5px;
          color:rgba(200,210,220,0.2);
          text-align:center;
          padding:24px 0;
        }
      `}</style>

      <div className="adm-page-title">
        Dashboard
      </div>

      <div className="adm-page-sub">
        Platform overview
      </div>

      {loading || !stats ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* STATS */}
          <div className="adm-stat-grid">
            {STAT_DEFS.map(
              ({
                key,
                label,
                icon: Icon,
                color,
                toFixed,
              }) => (
                <div
                  key={key}
                  className="adm-stat"
                  style={{ "--sc": color }}
                >
                  <div className="adm-stat-head">
                    <Icon
                      size={14}
                      color={color}
                    />

                    <span className="adm-stat-label">
                      {label}
                    </span>
                  </div>

                  <div className="adm-stat-val">
                    {toFixed != null
                      ? Number(
                          stats[key] ?? 0
                        ).toFixed(toFixed)
                      : (
                          stats[key] ?? 0
                        ).toLocaleString()}
                  </div>
                </div>
              )
            )}
          </div>

          {/* PANELS */}
          <div className="adm-panels">
            {/* TOP PLAYERS */}
            <div
              className="adm-panel"
              style={{
                "--pc":
                  "rgba(230,184,74,0.4)",
              }}
            >
              <div className="adm-panel-title">
                <Trophy
                  size={13}
                  color="#e6b84a"
                />

                Top players
              </div>

              {topPlayers.length === 0 ? (
                <p className="adm-empty">
                  No players yet
                </p>
              ) : (
                topPlayers
                  .slice(0, 5)
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className="adm-row"
                    >
                      <span
                        className={`adm-row-rank ${
                          i < 3 ? "top" : ""
                        }`}
                      >
                        {String(i + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <img
                        src={getAvatar(p)}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/adventurer/png?seed=${p.username}`;
                        }}
                        alt={p.username}
                        className="adm-avatar"
                      />

                      <span className="adm-row-name">
                        {p.username}
                      </span>

                      <span className="adm-row-val">
                        {(
                          p.totalScore || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))
              )}
            </div>

            {/* GAMES */}
            <div
              className="adm-panel"
              style={{
                "--pc":
                  "rgba(126,184,212,0.35)",
              }}
            >
              <div className="adm-panel-title">
                <Gamepad2
                  size={13}
                  color="#7eb8d4"
                />

                Games
              </div>

              {games.length === 0 ? (
                <p className="adm-empty">
                  No games yet
                </p>
              ) : (
                games.slice(0, 5).map((g) => (
                  <div
                    key={g.id}
                    className="adm-row"
                  >
                    <span className="adm-row-name">
                      {g.title}
                    </span>

                    <span
                      className={`adm-pill ${
                        g.enabled !== false
                          ? "on"
                          : ""
                      }`}
                    >
                      {g.enabled !== false
                        ? "Live"
                        : "Off"}
                    </span>

                    <span
                      className="adm-pill"
                      style={{
                        marginLeft: 4,
                      }}
                    >
                      {g.category ||
                        "Arcade"}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* RECENT USERS */}
            <div
              className="adm-panel"
              style={{
                "--pc":
                  "rgba(106,172,122,0.35)",
              }}
            >
              <div className="adm-panel-title">
                <Users
                  size={13}
                  color="#6aac7a"
                />

                Recent players
              </div>

              {recentUsers.length === 0 ? (
                <p className="adm-empty">
                  No users yet
                </p>
              ) : (
                recentUsers
                  .slice(0, 5)
                  .map((u) => (
                    <div
                      key={u.id}
                      className="adm-row"
                    >
                      <img
                        src={getAvatar(u)}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/adventurer/png?seed=${u.username}`;
                        }}
                        alt={u.username}
                        className="adm-avatar"
                      />

                      <span className="adm-row-name">
                        {u.username}
                      </span>

                      <span
                        className={`adm-pill ${
                          u.banned
                            ? "banned"
                            : ""
                        }`}
                      >
                        {u.banned
                          ? "Banned"
                          : "Player"}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}