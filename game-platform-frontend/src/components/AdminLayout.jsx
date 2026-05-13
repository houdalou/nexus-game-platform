import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Gamepad2, Users, BarChart3,
  Settings, ArrowLeft, Menu, X, Shield, Activity
} from "lucide-react";
import api from "../api/axios";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Gamepad2, label: "Games", path: "/admin/games" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Activity, label: "Activities", path: "/admin/activities" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        if (res.data.role !== "ADMIN" && res.data.role !== "ROLE_ADMIN") {
          navigate("/dashboard");
        } else {
          setUser(res.data);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  if (!user) {
    return (
      <div style={{ padding: 40 }}>Loading...</div>
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin {
          display: flex;
          min-height: 100vh;
          font-family: 'Rajdhani', sans-serif;
          background: #080a0e;
          color: #e8e8e0;
          position: relative;
        }

        .admin::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(126,184,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126,184,212,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* SIDEBAR */
        .sidebar {
          width: 220px;
          background: rgba(8,10,14,0.92);
          border-right: 1px solid rgba(126,184,212,0.12);
          color: #e8e8e0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 10;
        }

        .sidebar.closed {
          width: 70px;
          padding: 20px 12px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px;
          margin-bottom: 32px;
        }

        .logo {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 3px;
          color: #7eb8d4;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .logo span { color: #d4a84b; }

        .menu-btn {
          background: none;
          border: 1px solid rgba(126,184,212,0.3);
          color: #7eb8d4;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .menu-btn:hover { background: rgba(126,184,212,0.08); border-color: #7eb8d4; }

        .nav {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 4px;
          color: rgba(232,232,224,0.5);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .item:hover {
          background: rgba(126,184,212,0.08);
          color: #7eb8d4;
          transform: translateX(2px);
        }

        .active {
          background: rgba(126,184,212,0.1);
          color: #7eb8d4;
          border: 1px solid rgba(126,184,212,0.25);
        }

        .footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(126,184,212,0.1);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .back {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(232,232,224,0.5);
          text-decoration: none;
          font-size: 12px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
          padding: 10px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .back:hover {
          color: #d4a84b;
          background: rgba(212,168,75,0.08);
        }

        /* MAIN */
        .main {
          flex: 1;
          padding: 32px;
          background: transparent;
          overflow-y: auto;
          position: relative;
          z-index: 5;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            transform: translateX(${open ? "0" : "-100%"});
          }
          .main { padding: 20px; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "" : "closed"}`}>

        <div className="top">
          <div className="logo">
            <Shield size={14} /> ADMIN
          </div>

          <button className="menu-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="nav">
          {ADMIN_NAV.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`item ${
                location.pathname === path ? "active" : ""
              }`}
            >
              <Icon size={18} />
              {open && <span className="label">{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="footer">
          <Link to="/dashboard" className="back">
            <ArrowLeft size={16} />
            {open && "Back"}
          </Link>

          <div className="item" onClick={logout}>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">{children}</main>
    </div>
  );
}