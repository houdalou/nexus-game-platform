// AdminAnalytics.jsx

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Trophy,
  ShieldAlert,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusMessage from "../../components/StatusMessage";
import userService from "../../services/userService";

export default function AdminAnalytics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await userService.getAll();

      // REMOVE ADMINS
      const players = (res.data || []).filter(
        (u) =>
          u.role !== "ADMIN" &&
          u.role !== "ROLE_ADMIN"
      );

      setUsers(players);
    } catch (err) {
      console.error(err);

      setStatus({
        type: "error",
        message: "Failed to load analytics",
      });
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS ONLY FOR PLAYERS
  const analytics = useMemo(() => {
    const totalPlayers = users.length;

    const activePlayers = users.filter(
      (u) => !u.banned
    ).length;

    const bannedPlayers = users.filter(
      (u) => u.banned
    ).length;

    const totalXP = users.reduce(
      (sum, u) => sum + (u.xp || 0),
      0
    );

    const averageLevel =
      totalPlayers > 0
        ? (
            users.reduce(
              (sum, u) => sum + (u.level || 1),
              0
            ) / totalPlayers
          ).toFixed(1)
        : 0;

    return {
      totalPlayers,
      activePlayers,
      bannedPlayers,
      totalXP,
      averageLevel,
    };
  }, [users]);

  const getAvatar = (user) => {
    if (
      user?.avatarUrl &&
      user.avatarUrl.trim() !== ""
    ) {
      return user.avatarUrl;
    }

    return `https://api.dicebear.com/7.x/adventurer/png?seed=${user.username}`;
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--pink)",
              marginBottom: 6,
            }}
          >
            ANALYTICS DASHBOARD
          </h1>

          <p
            style={{
              color: "var(--text-dim)",
              fontSize: 13,
            }}
          >
            Player statistics overview
          </p>
        </div>

        <StatusMessage status={status} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <AnalyticsCard
                title="Total Players"
                value={analytics.totalPlayers}
                icon={<Users size={20} />}
                color="var(--pink)"
              />

              <AnalyticsCard
                title="Active Players"
                value={analytics.activePlayers}
                icon={<UserCheck size={20} />}
                color="var(--green)"
              />

              <AnalyticsCard
                title="Banned Players"
                value={analytics.bannedPlayers}
                icon={<UserX size={20} />}
                color="var(--red)"
              />

              <AnalyticsCard
                title="Total XP"
                value={analytics.totalXP}
                icon={<Trophy size={20} />}
                color="var(--cyan)"
              />

              <AnalyticsCard
                title="Average Level"
                value={analytics.averageLevel}
                icon={<ShieldAlert size={20} />}
                color="var(--yellow)"
              />
            </div>

            {/* PLAYERS TABLE */}
            <div
              style={{
                background: "var(--bg-card)",
                border:
                  "1px solid var(--border-dim)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: 16,
                  borderBottom:
                    "1px solid var(--border-dim)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: 2,
                  fontSize: 12,
                  color: "var(--text-dim)",
                }}
              >
                PLAYERS
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "Player",
                        "Level",
                        "XP",
                        "Status",
                      ].map((head) => (
                        <th
                          key={head}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            fontSize: 11,
                            color: "var(--text-dim)",
                            borderBottom:
                              "1px solid var(--border-dim)",
                            letterSpacing: 1,
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          borderBottom:
                            "1px solid var(--border-dim)",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <img
                              src={getAvatar(user)}
                              onError={(e) => {
                                e.target.src = `https://api.dicebear.com/7.x/adventurer/png?seed=${user.username}`;
                              }}
                              alt={user.username}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border:
                                  "1px solid var(--border-dim)",
                              }}
                            />

                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                {user.username}
                              </div>

                              <div
                                style={{
                                  fontSize: 12,
                                  color:
                                    "var(--text-dim)",
                                }}
                              >
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          style={{
                            padding: "14px 16px",
                          }}
                        >
                          LV.{user.level || 1}
                        </td>

                        <td
                          style={{
                            padding: "14px 16px",
                          }}
                        >
                          {user.xp || 0}
                        </td>

                        <td
                          style={{
                            padding: "14px 16px",
                          }}
                        >
                          <span
                            style={{
                              color: user.banned
                                ? "var(--red)"
                                : "var(--green)",
                              fontWeight: 600,
                            }}
                          >
                            {user.banned
                              ? "BANNED"
                              : "ACTIVE"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: 40,
                            textAlign: "center",
                            color:
                              "var(--text-dim)",
                          }}
                        >
                          No players found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function AnalyticsCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            color: "var(--text-dim)",
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          {title}
        </div>

        <div style={{ color }}>
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}