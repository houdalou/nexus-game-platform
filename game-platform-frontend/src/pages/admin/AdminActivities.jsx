import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, User, Gamepad2, Filter } from "lucide-react";
import auditService from "../../services/auditService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminActivities() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = filter === "ALL" 
        ? await auditService.getAll()
        : await auditService.getByAction(filter);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ACTIONS = ["ALL", "USER_CREATED", "USER_UPDATED", "USER_DELETED", "BAN_USER", "UNBAN_USER", "RESET_PASSWORD", "GAME_ENABLED", "GAME_DISABLED", "GAME_CREATED", "GAME_DELETED"];

  return (
    <AdminLayout>
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#7eb8d4", margin: "0 0 8px" }}>
          ACTIVITIES
        </h1>
        <p style={{ margin: "0 0 24px", color: "rgba(232,232,224,0.5)", fontSize: 13 }}>
          Admin action audit log
        </p>

        <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => setFilter(action)}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: `1px solid ${filter === action ? "rgba(126,184,212,0.5)" : "rgba(126,184,212,0.2)"}`,
                background: filter === action ? "rgba(126,184,212,0.1)" : "transparent",
                color: filter === action ? "#7eb8d4" : "rgba(232,232,224,0.5)",
                fontSize: 12,
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 1,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {action}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ background: "rgba(8,10,14,0.6)", border: "1px solid rgba(126,184,212,0.12)", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "rgba(126,184,212,0.05)", borderBottom: "1px solid rgba(126,184,212,0.12)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, color: "#7eb8d4" }}>TIMESTAMP</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, color: "#7eb8d4" }}>ADMIN</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, color: "#7eb8d4" }}>ACTION</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, color: "#7eb8d4" }}>TARGET</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, color: "#7eb8d4" }}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: "1px solid rgba(126,184,212,0.08)" }}
                    >
                      <td style={{ padding: "12px 16px", color: "rgba(232,232,224,0.7)" }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#d4a84b", fontWeight: 600 }}>
                        {log.adminUsername}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: 1,
                          background: "rgba(126,184,212,0.1)",
                          color: "#7eb8d4",
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "rgba(232,232,224,0.7)" }}>
                        {log.target}
                      </td>
                      <td style={{ padding: "12px 16px", color: "rgba(232,232,224,0.5)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {log.details || "-"}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "rgba(232,232,224,0.3)" }}>
                      No activity logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
