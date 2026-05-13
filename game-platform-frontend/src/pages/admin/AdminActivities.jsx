import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Shield,
  User,
  Gamepad2,
  Filter,
  Ban,
  Unlock,
  KeyRound,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import auditService from "../../services/auditService";
import userService from "../../services/userService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

const ACTIONS = [
  "ALL",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "BAN_USER",
  "UNBAN_USER",
  "RESET_PASSWORD",
  "GAME_ENABLED",
  "GAME_DISABLED",
  "GAME_CREATED",
  "GAME_DELETED",
];

const actionConfig = {
  USER_CREATED: {
    color: "#6aac7a",
    icon: Plus,
    label: "User Created",
  },
  USER_UPDATED: {
    color: "#7eb8d4",
    icon: User,
    label: "User Updated",
  },
  USER_DELETED: {
    color: "#e05c68",
    icon: Trash2,
    label: "User Deleted",
  },
  BAN_USER: {
    color: "#ff5f5f",
    icon: Ban,
    label: "User Banned",
  },
  UNBAN_USER: {
    color: "#6aac7a",
    icon: Unlock,
    label: "User Unbanned",
  },
  RESET_PASSWORD: {
    color: "#e6b84a",
    icon: KeyRound,
    label: "Password Reset",
  },
  GAME_ENABLED: {
    color: "#6aac7a",
    icon: Gamepad2,
    label: "Game Enabled",
  },
  GAME_DISABLED: {
    color: "#e05c68",
    icon: Gamepad2,
    label: "Game Disabled",
  },
  GAME_CREATED: {
    color: "#a78bfa",
    icon: Gamepad2,
    label: "Game Created",
  },
  GAME_DELETED: {
    color: "#ff5f5f",
    icon: Trash2,
    label: "Game Deleted",
  },
};

export default function AdminActivities() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res =
        filter === "ALL"
          ? await auditService.getAll()
          : await auditService.getByAction(filter);

      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: logs.length,
      userActions: logs.filter((l) =>
        l.action?.includes("USER")
      ).length,
      gameActions: logs.filter((l) =>
        l.action?.includes("GAME")
      ).length,
      securityActions: logs.filter((l) =>
        ["BAN_USER", "UNBAN_USER", "RESET_PASSWORD"].includes(
          l.action
        )
      ).length,
    };
  }, [logs]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateStatus(null);

    try {
      await userService.create(createForm);
      setCreateStatus({ type: "success", msg: "User created successfully" });
      setCreateForm({ username: "", email: "", password: "", role: "USER" });
      setTimeout(() => {
        setShowCreateModal(false);
        fetchLogs();
      }, 1000);
    } catch (err) {
      setCreateStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to create user",
      });
    } finally {
      setCreateLoading(false);
    }
  };

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
          font-family:'JetBrains Mono', monospace;
          font-size:11px;
          letter-spacing:1.5px;
          color:rgba(200,210,220,0.3);
          margin-bottom:28px;
        }

        .adm-stat-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
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
        }

        .adm-stat::before{
          content:'';
          position:absolute;
          top:0;
          left:20%;
          right:20%;
          height:1px;
          background:var(--sc);
          opacity:0.5;
        }

        .adm-stat-head{
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:12px;
        }

        .adm-stat-label{
          font-family:'JetBrains Mono', monospace;
          font-size:10px;
          letter-spacing:1.5px;
          color:rgba(200,210,220,0.3);
          text-transform:uppercase;
        }

        .adm-stat-val{
          font-size:28px;
          font-weight:700;
          color:var(--sc);
        }

        .adm-filter-wrap{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:20px;
        }

        .adm-filter{
          padding:8px 14px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.08);
          background:transparent;
          color:rgba(200,210,220,0.5);
          cursor:pointer;
          font-size:11px;
          font-family:'JetBrains Mono', monospace;
          letter-spacing:1px;
          transition:all .2s;
        }

        .adm-filter.active{
          border-color:#7eb8d4;
          background:rgba(126,184,212,0.1);
          color:#7eb8d4;
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
            rgba(126,184,212,0.4),
            transparent
          );
        }

        .adm-panel-title{
          display:flex;
          align-items:center;
          gap:8px;
          font-family:'JetBrains Mono', monospace;
          font-size:10px;
          letter-spacing:2px;
          text-transform:uppercase;
          color:rgba(200,210,220,0.3);
          margin-bottom:18px;
        }

        .adm-row{
          display:flex;
          align-items:center;
          gap:12px;
          padding:14px 0;
          border-bottom:1px solid rgba(255,255,255,0.05);
        }

        .adm-row:last-child{
          border-bottom:none;
        }

        .adm-avatar{
          width:38px;
          height:38px;
          border-radius:50%;
          object-fit:cover;
          border:1px solid rgba(255,255,255,0.08);
          flex-shrink:0;
        }

        .adm-row-main{
          flex:1;
          min-width:0;
        }

        .adm-row-name{
          font-size:14px;
          font-weight:600;
          color:#d8dde8;
          margin-bottom:4px;
        }

        .adm-row-sub{
          font-size:12px;
          color:rgba(232,232,224,0.45);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .adm-row-time{
          font-size:11px;
          color:rgba(200,210,220,0.3);
          font-family:'JetBrains Mono', monospace;
          margin-top:5px;
        }

        .adm-pill{
          display:flex;
          align-items:center;
          gap:6px;
          padding:6px 10px;
          border-radius:8px;
          border:1px solid;
          font-size:10px;
          font-family:'JetBrains Mono', monospace;
          letter-spacing:1px;
          white-space:nowrap;
          text-transform:uppercase;
        }

        .adm-empty{
          text-align:center;
          padding:40px 0;
          color:rgba(200,210,220,0.25);
          font-family:'JetBrains Mono', monospace;
          font-size:11px;
          letter-spacing:1px;
        }

        .adm-create-btn{
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px 16px;
          border-radius:8px;
          border:1px solid rgba(106,172,122,0.3);
          background:rgba(106,172,122,0.08);
          color:#6aac7a;
          cursor:pointer;
          font-size:11px;
          font-family:'JetBrains Mono', monospace;
          letter-spacing:1px;
          transition:all .2s;
        }
        .adm-create-btn:hover{
          background:rgba(106,172,122,0.15);
          border-color:#6aac7a;
        }

        .adm-modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.7);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:1000;
        }
        .adm-modal{
          background:rgba(10,13,24,0.95);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:16px;
          padding:24px;
          width:100%;
          max-width:400px;
        }
        .adm-modal-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
        }
        .adm-modal-title{
          font-size:18px;
          font-weight:700;
          color:#d8dde8;
        }
        .adm-modal-close{
          width:32px;
          height:32px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:transparent;
          color:rgba(200,210,220,0.5);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:all .2s;
        }
        .adm-modal-close:hover{
          background:rgba(255,255,255,0.05);
          color:#d8dde8;
        }
        .adm-form-group{
          margin-bottom:16px;
        }
        .adm-form-label{
          display:block;
          font-size:12px;
          color:rgba(200,210,220,0.5);
          margin-bottom:6px;
          font-family:'JetBrains Mono', monospace;
          letter-spacing:1px;
        }
        .adm-form-input{
          width:100%;
          padding:10px 12px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(0,0,0,0.3);
          color:#d8dde8;
          font-size:13px;
          outline:none;
          transition:border-color .2s;
        }
        .adm-form-input:focus{
          border-color:#7eb8d4;
        }
        .adm-form-select{
          width:100%;
          padding:10px 12px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(0,0,0,0.3);
          color:#d8dde8;
          font-size:13px;
          outline:none;
          cursor:pointer;
        }
        .adm-form-submit{
          width:100%;
          padding:12px;
          border-radius:8px;
          border:none;
          background:#6aac7a;
          color:#06080f;
          font-weight:600;
          font-size:13px;
          cursor:pointer;
          transition:background .2s;
        }
        .adm-form-submit:hover{
          background:#7bc28b;
        }
        .adm-form-submit:disabled{
          opacity:0.5;
          cursor:not-allowed;
        }
        .adm-form-status{
          font-size:12px;
          text-align:center;
          margin-top:12px;
          font-family:'JetBrains Mono', monospace;
        }
        .adm-form-status.error{
          color:#e05c68;
        }
        .adm-form-status.success{
          color:#6aac7a;
        }
      `}</style>

      <div className="adm-page-title">Activities</div>

      <div className="adm-page-sub">
        Admin audit & security activity
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* STATS */}
          <div className="adm-stat-grid">
            <StatCard
              label="Total Logs"
              value={stats.total}
              color="#7eb8d4"
              icon={Activity}
            />

            <StatCard
              label="User Actions"
              value={stats.userActions}
              color="#6aac7a"
              icon={User}
            />

            <StatCard
              label="Game Actions"
              value={stats.gameActions}
              color="#a78bfa"
              icon={Gamepad2}
            />

            <StatCard
              label="Security"
              value={stats.securityActions}
              color="#e05c68"
              icon={Shield}
            />
          </div>

          {/* FILTERS */}
          <div className="adm-filter-wrap">
            <button
              className="adm-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={14} />
              Create User
            </button>
            {ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => setFilter(action)}
                className={`adm-filter ${
                  filter === action ? "active" : ""
                }`}
              >
                {action.replaceAll("_", " ")}
              </button>
            ))}
          </div>

          {/* LOGS */}
          <div className="adm-panel">
            <div className="adm-panel-title">
              <Activity size={13} color="#7eb8d4" />
              Activity Feed
            </div>

            {logs.length === 0 ? (
              <div className="adm-empty">
                No activity logs found
              </div>
            ) : (
              logs.map((log, index) => {
                const config =
                  actionConfig[log.action] || {};

                const color =
                  config.color || "#7eb8d4";

                const Icon =
                  config.icon || Activity;

                return (
                  <motion.div
                    key={log.id}
                    className="adm-row"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <img
                      src={
                        log.adminAvatarUrl &&
                        log.adminAvatarUrl.trim() !== ""
                          ? log.adminAvatarUrl
                          : `https://api.dicebear.com/7.x/pixel-art/svg?seed=${log.adminUsername}`
                      }
                      alt=""
                      className="adm-avatar"
                    />

                    <div className="adm-row-main">
                      <div className="adm-row-name">
                        {log.adminUsername}
                      </div>

                      <div className="adm-row-sub">
                        {log.details || log.target || "No details"}
                      </div>

                      <div className="adm-row-time">
                        {new Date(
                          log.timestamp
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div
                      className="adm-pill"
                      style={{
                        borderColor: `${color}40`,
                        background: `${color}12`,
                        color,
                      }}
                    >
                      <Icon size={12} />
                      {config.label || log.action}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <div className="adm-modal-title">Create User</div>
              <button
                className="adm-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="adm-form-group">
                <label className="adm-form-label">Username</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Email</label>
                <input
                  type="email"
                  className="adm-form-input"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                  placeholder="Enter email"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Password</label>
                <input
                  type="password"
                  className="adm-form-input"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Role</label>
                <select
                  className="adm-form-select"
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="adm-form-submit"
                disabled={createLoading}
              >
                {createLoading ? "Creating..." : "Create User"}
              </button>

              {createStatus && (
                <div
                  className={`adm-form-status ${createStatus.type}`}
                >
                  {createStatus.msg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  color,
  icon: Icon,
}) {
  return (
    <div className="adm-stat" style={{ "--sc": color }}>
      <div className="adm-stat-head">
        <Icon size={14} color={color} />
        <span className="adm-stat-label">
          {label}
        </span>
      </div>

      <div className="adm-stat-val">
        {Number(value || 0).toLocaleString()}
      </div>
    </div>
  );
}