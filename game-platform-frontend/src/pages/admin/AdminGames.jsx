import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Plus, Trash2, Edit3, X, Save, Power } from "lucide-react";
import gameService from "../../services/gameService";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import CyberpunkModal from "../../components/CyberpunkModal";
import StatusMessage from "../../components/StatusMessage";

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ARCADE",
    difficulty: "MEDIUM",
    xpReward: "",
    slug: "",
    enabled: true,
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await gameService.getAllAdmin();
      setGames(res.data);
    } catch {
      setStatus({ type: "error", message: "Failed to load games" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game?")) return;
    try {
      await gameService.delete(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      setStatus({ type: "success", message: "Game deleted" });
    } catch {
      setStatus({ type: "error", message: "Delete failed" });
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await gameService.update(editing.id, form);
      } else {
        await gameService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", description: "", category: "ARCADE", difficulty: "MEDIUM", xpReward: "", slug: "", enabled: true });
      fetchGames();
      setStatus({ type: "success", message: "Saved successfully" });
    } catch {
      setStatus({ type: "error", message: "Save failed" });
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await gameService.toggle(id);
      setGames((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setStatus({ type: "success", message: `Game ${res.data.enabled ? "enabled" : "disabled"}` });
    } catch {
      setStatus({ type: "error", message: "Toggle failed" });
    }
  };

  const startEdit = (game) => {
    setEditing(game);
    setForm({
      title: game.title || "",
      description: game.description || "",
      category: game.category || "ARCADE",
      difficulty: game.difficulty || "MEDIUM",
      xpReward: game.xpReward || "",
      slug: game.slug || "",
      enabled: game.enabled !== false,
    });
    setShowForm(true);
    setStatus(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", category: "ARCADE", difficulty: "MEDIUM", xpReward: "", slug: "", enabled: true });
    setShowForm(true);
    setStatus(null);
  };

  return (
    <AdminLayout>
      <div style={{ animation: "fadeIn 0.5s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--pink)", margin: 0 }}>
            GAME MANAGEMENT
          </h1>
          <button
            onClick={openCreate}
            style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,43,214,0.3)",
              background: "rgba(255,43,214,0.08)", color: "var(--pink)",
              fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2,
              cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Plus size={16} /> ADD GAME
          </button>
        </div>

        <StatusMessage status={status} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%", borderCollapse: "collapse",
                background: "var(--bg-card)", border: "1px solid var(--border-dim)",
                borderRadius: 10, overflow: "hidden",
              }}
            >
              <thead>
                <tr>
                  {["Title", "Category", "Difficulty", "XP", "Slug", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left", padding: "12px 16px", fontSize: 10,
                        fontFamily: "var(--font-display)", letterSpacing: 2,
                        color: "var(--text-dim)", borderBottom: "1px solid var(--border-dim)",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <motion.tr
                    key={g.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ opacity: g.enabled === false ? 0.5 : 1 }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <strong>{g.title}</strong>
                      <br />
                      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        {g.description?.slice(0, 40) || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{g.category || "ARCADE"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{g.difficulty || "MEDIUM"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{g.xpReward || 0}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>{g.slug || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "2px 8px", borderRadius: 4,
                          background: g.enabled !== false ? "rgba(0,255,157,0.1)" : "rgba(255,43,214,0.1)",
                          color: g.enabled !== false ? "var(--green)" : "var(--pink)",
                          fontSize: 10, fontFamily: "var(--font-display)",
                        }}
                      >
                        {g.enabled !== false ? "ENABLED" : "DISABLED"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => startEdit(g)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggle(g.id)}
                          style={{
                            background: "none", border: "none",
                            color: g.enabled !== false ? "var(--green)" : "var(--pink)",
                            cursor: "pointer", padding: 4, borderRadius: 4,
                          }}
                          title={g.enabled !== false ? "Disable" : "Enable"}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 4, borderRadius: 4 }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {games.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
                      No games found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <CyberpunkModal open={showForm} onClose={() => setShowForm(false)} title={editing ? "EDIT GAME" : "ADD GAME"}>
          <StatusMessage status={status} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Title</label>
            <input
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Description</label>
            <input
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Category</label>
              <select
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>ARCADE</option>
                <option>QUIZ</option>
                <option>CHESS</option>
                <option>MEMORY</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Difficulty</label>
              <select
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>XP Reward</label>
              <input
                type="number"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
                value={form.xpReward}
                onChange={(e) => setForm({ ...form, xpReward: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: "var(--font-display)", letterSpacing: 2, color: "var(--text-dim)", marginBottom: 6, display: "block" }}>Slug</label>
              <input
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-dim)", background: "rgba(0,0,0,0.4)", color: "var(--text)", outline: "none" }}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
          </div>
          {editing && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                style={{ cursor: "pointer" }}
              />
              <label style={{ fontSize: 13, color: "var(--text)", cursor: "pointer" }}>Enabled</label>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1, padding: 10, borderRadius: 8, border: "1px solid rgba(255,43,214,0.3)",
                background: "rgba(255,43,214,0.1)", color: "var(--pink)",
                fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, cursor: "pointer",
              }}
            >
              <Save size={14} style={{ display: "inline", marginRight: 6 }} /> SAVE
            </button>
            <button
              onClick={() => setShowForm(false)}
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

