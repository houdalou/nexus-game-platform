import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save } from "lucide-react";
import userService from "../../services/userService";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusMessage from "../../components/StatusMessage";

export default function Settings() {
  const [tab, setTab] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const [profile, setProfile] = useState({ username: "", email: "", avatarUrl: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getMe();
      setProfile({
        username: res.data.username || "",
        email: res.data.email || "",
        avatarUrl: res.data.avatarUrl || "",
      });
    } catch {
      setStatus({ type: "error", message: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const saveAccount = async () => {
    setSaving(true);
    try {
      await userService.updateMe(profile);
      setStatus({ type: "success", message: "Profile updated" });
    } catch {
      setStatus({ type: "error", message: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (!passwords.newPass || passwords.newPass.length < 4) {
      setStatus({ type: "error", message: "Password too short" });
      return;
    }
    setSaving(true);
    try {
      await userService.updateMe({ password: passwords.newPass });
      setPasswords({ current: "", newPass: "" });
      setStatus({ type: "success", message: "Password updated" });
    } catch {
      setStatus({ type: "error", message: "Password update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="settings-page">
        <style>{`
          .settings-page { animation: fadeIn 0.5s ease; }
          .settings-title { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--cyan); margin:0 0 8px; text-shadow:0 0 20px rgba(0,240,255,0.15); }
          .settings-sub { color:var(--text-dim); font-size:13px; margin:0 0 32px; }
          .settings-tabs { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; }
          .settings-tab {
            padding:8px 16px; border-radius:8px; border:1px solid var(--border-dim);
            background:var(--bg-card); color:var(--text-dim); font-size:12px;
            font-family:var(--font-display); letter-spacing:1px; cursor:pointer;
            transition:all 0.2s; display:flex; align-items:center; gap:6px;
          }
          .settings-tab:hover { border-color:var(--border); color:var(--text); }
          .settings-tab.active { border-color:var(--cyan); color:var(--cyan); background:rgba(0,240,255,0.06); }
          .settings-card {
            background:var(--bg-card); border:1px solid var(--border-dim);
            border-radius:var(--radius); padding:28px; max-width:600px;
            backdrop-filter:blur(14px);
          }
          .settings-field { margin-bottom:18px; }
          .settings-label { font-size:10px; font-family:var(--font-display); letter-spacing:2px; color:var(--text-dim); margin-bottom:6px; display:block; }
          .settings-input {
            width:100%; padding:10px 12px; border-radius:8px;
            border:1px solid var(--border-dim); background:rgba(0,0,0,0.4);
            color:var(--text); outline:none; transition:all 0.2s;
          }
          .settings-input:focus { border-color:var(--cyan); box-shadow:0 0 0 2px rgba(0,240,255,0.15); }
          .settings-btn {
            padding:10px 24px; border-radius:8px; border:1px solid rgba(0,240,255,0.25);
            background:rgba(0,240,255,0.08); color:var(--cyan);
            font-family:var(--font-display); font-size:11px; letter-spacing:2px;
            cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px;
          }
          .settings-btn:hover { background:rgba(0,240,255,0.15); box-shadow:0 0 16px rgba(0,240,255,0.1); }
          .settings-btn:disabled { opacity:0.5; cursor:not-allowed; }
        `}</style>
        <h1 className="settings-title">SETTINGS</h1>
        <p className="settings-sub">// CUSTOMIZE YOUR EXPERIENCE</p>

        <div className="settings-tabs">
          <button className={`settings-tab ${tab === "account" ? "active" : ""}`} onClick={() => setTab("account")}><User size={14} /> Account</button>
          <button className={`settings-tab ${tab === "security" ? "active" : ""}`} onClick={() => setTab("security")}><Lock size={14} /> Security</button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div className="settings-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={tab}>
            <StatusMessage status={status} />
            {tab === "account" && (
              <>
                <div className="settings-field">
                  <label className="settings-label">Username</label>
                  <input className="settings-input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Email</label>
                  <input className="settings-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Avatar URL</label>
                  <input className="settings-input" value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} />
                </div>
                <button className="settings-btn" onClick={saveAccount} disabled={saving}>
                  <Save size={14} /> {saving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </>
            )}
            {tab === "security" && (
              <>
                <div className="settings-field">
                  <label className="settings-label">New Password</label>
                  <input className="settings-input" type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="Min 4 characters" />
                </div>
                <button className="settings-btn" onClick={savePassword} disabled={saving}>
                  <Lock size={14} /> {saving ? "UPDATING..." : "UPDATE PASSWORD"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
