import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Save, X, Eye, Ban, Unlock, KeyRound, ShieldAlert } from "lucide-react";
import userService from "../../services/userService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import CyberpunkModal from "../../components/CyberpunkModal";
import StatusMessage from "../../components/StatusMessage";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
  });

  useEffect(() => {
    fetchMe();
    fetchUsers();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await userService.getMe();
      setMe(res.data);
    } catch {
      /* ignored */
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch {
      setStatus({ type: "error", message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.role !== "ADMIN" && u.role !== "ROLE_ADMIN");
  }, [users]);

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      avatarUrl: user.avatarUrl || "",
    });
    setStatus(null);
  };

  const openView = async (user) => {
    setViewingUser(user);
    setUserStats(null);
    try {
      const res = await userService.getStats(user.id);
      setUserStats(res.data);
    } catch {
      setUserStats(null);
    }
  };

  const saveUser = async () => {
    try {
      await userService.update(editingUser.id, form);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...form, password: undefined } : u
        )
      );
      setEditingUser(null);
      setStatus({ type: "success", message: "User updated" });
    } catch {
      setStatus({ type: "error", message: "Update failed" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStatus({ type: "success", message: "User deleted" });
    } catch {
      setStatus({ type: "error", message: "Delete failed" });
    }
  };

  const handleBan = async (user) => {
    try {
      if (user.banned) {
        await userService.unban(user.id);
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned: false } : u)));
        setStatus({ type: "success", message: "User unbanned" });
      } else {
        await userService.ban(user.id);
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned: true } : u)));
        setStatus({ type: "success", message: "User banned" });
      }
    } catch {
      setStatus({ type: "error", message: "Ban action failed" });
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      setStatus({ type: "error", message: "Password too short" });
      return;
    }
    try {
      await userService.resetPassword(resetUser.id, newPassword);
      setResetUser(null);
      setNewPassword("");
      setStatus({ type: "success", message: "Password reset" });
    } catch {
      setStatus({ type: "error", message: "Reset failed" });
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--pink)", margin: 0 }}>
            USER MANAGEMENT
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{filteredUsers.length} users</span>
          </div>
        </div>

        <StatusMessage status={status} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "var(--bg-card)",
                border: "1px solid var(--border-dim)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <thead>
                <tr>
                  {["User", "Email", "Role", "Level", "XP", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: 10,
                        fontFamily: "var(--font-display)",
                        letterSpacing: 2,
                        color: "var(--text-dim)",
                        borderBottom: "1px solid var(--border-dim)",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      borderBottom: "1px solid var(--border-dim)",
                      opacity: u.banned ? 0.6 : 1,
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.username}`}
                          alt=""
                          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border-dim)" }}
                        />
                        <span style={{ fontWeight: 600 }}>{u.username}</span>
                        {u.banned && (
                          <ShieldAlert size={14} color="var(--pink)" />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{u.email || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: u.role === "ADMIN" ? "rgba(0,240,255,0.1)" : "rgba(255,43,214,0.1)",
                          color: u.role === "ADMIN" ? "var(--cyan)" : "var(--pink)",
                          fontSize: 10,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>LV.{u.level || 1}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{u.xp || 0}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12 }}>
                      <span style={{ color: u.banned ? "var(--pink)" : "var(--green)" }}>
                        {u.banned ? "BANNED" : "ACTIVE"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="icon-btn"
                          title="View details"
                          onClick={() => openView(u)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() => openEdit(u)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="icon-btn"
                          title={u.banned ? "Unban" : "Ban"}
                          onClick={() => handleBan(u)}
                          style={{ background: "none", border: "none", color: u.banned ? "var(--green)" : "var(--pink)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                        >
                          {u.banned ? <Unlock size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          className="icon-btn"
                          title="Reset password"
                          onClick={() => { setResetUser(u); setNewPassword(""); setStatus(null); }}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() => handleDelete(u.id)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT MODAL */}
        <CyberpunkModal open={!!editingUser} onClose={() => setEditingUser(null)} title="EDIT USER">
          <StatusMessage status={status} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Username</label>
            <input
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none",
              }}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Email</label>
            <input
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none",
              }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>New Password (optional)</label>
            <input
              type="password"
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none",
              }}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Avatar URL</label>
            <input
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none",
              }}
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={saveUser}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: "1px solid rgba(255,43,214,0.3)",
                background: "rgba(255,43,214,0.1)", color: "var(--pink)",
                fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, cursor: "pointer",
              }}
            >
              <Save size={14} style={{ display: "inline", marginRight: 6 }} /> SAVE
            </button>
            <button
              onClick={() => setEditingUser(null)}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "transparent", color: "var(--text-dim)",
                fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, cursor: "pointer",
              }}
            >
              CANCEL
            </button>
          </div>
        </CyberpunkModal>

        {/* VIEW DETAILS MODAL */}
        <CyberpunkModal open={!!viewingUser} onClose={() => setViewingUser(null)} title="USER DETAILS">
          {viewingUser && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <img
                  src={viewingUser.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${viewingUser.username}`}
                  alt=""
                  style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border-dim)" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{viewingUser.username}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{viewingUser.email || "No email"}</div>
                </div>
              </div>
              {userStats ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <StatBox label="Level" value={`LV.${userStats.level || 1}`} />
                  <StatBox label="XP" value={userStats.xp || 0} />
                  <StatBox label="Total Score" value={userStats.totalScore || 0} />
                  <StatBox label="Badge" value={userStats.badge || "—"} />
                  <StatBox label="Role" value={userStats.role || "—"} />
                  <StatBox label="Status" value={userStats.banned ? "BANNED" : "ACTIVE"} color={userStats.banned ? "var(--pink)" : "var(--green)"} />
                </div>
              ) : (
                <LoadingSpinner size={24} />
              )}
            </div>
          )}
        </CyberpunkModal>

        {/* RESET PASSWORD MODAL */}
        <CyberpunkModal open={!!resetUser} onClose={() => setResetUser(null)} title="RESET PASSWORD" maxWidth={360}>
          <StatusMessage status={status} />
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
            Reset password for <strong style={{ color: "var(--text)" }}>{resetUser?.username}</strong>
          </p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>New Password</label>
            <input
              type="password"
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none",
              }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleResetPassword}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: "1px solid rgba(255,43,214,0.3)",
                background: "rgba(255,43,214,0.1)", color: "var(--pink)",
                fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, cursor: "pointer",
              }}
            >
              <KeyRound size={14} style={{ display: "inline", marginRight: 6 }} /> RESET
            </button>
            <button
              onClick={() => setResetUser(null)}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border-dim)",
                background: "transparent", color: "var(--text-dim)",
                fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, cursor: "pointer",
              }}
            >
              CANCEL
            </button>
          </div>
        </CyberpunkModal>
      </div>
    </AdminLayout>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8, border: "1px solid var(--border-dim)" }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || "var(--cyan)" }}>{value}</div>
    </div>
  );
}
