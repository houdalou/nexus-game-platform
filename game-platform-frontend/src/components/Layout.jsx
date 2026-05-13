import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Home, Gamepad2, Trophy, Award, User, Settings,
  LogOut, Menu, X,
} from "lucide-react";
import api from "../api/axios";

const NAV_ITEMS = [
  { icon: Home,     label: "HOME",         path: "/dashboard"    },
  { icon: Gamepad2, label: "GAMES",        path: "/games"        },
  { icon: Trophy,   label: "RANKS",        path: "/rankings"     },
  { icon: Award,    label: "ACHIEVEMENTS", path: "/achievements" },
  { icon: User,     label: "PROFILE",      path: "/profile"      },
  { icon: Settings, label: "SETTINGS",     path: "/settings"     },
];

export default function Layout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="nx-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080a0e; }

        .nx-layout {
          display: flex;
          min-height: 100vh;
          background: #080a0e;
          color: #e8e8e0;
          font-family: 'Rajdhani', sans-serif;
          position: relative;
        }

        .nx-layout::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,75,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,75,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── SIDEBAR ── */
        .nx-sidebar {
          width: 80px;
          background: rgba(8,10,14,0.92);
          border-right: 1px solid rgba(212,168,75,0.12);
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 100;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          transition: width 0.32s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .nx-sidebar.open { width: 240px; }

        .nx-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          min-height: 48px;
        }

        .nx-logo {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #d4a84b;
          white-space: nowrap;
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.25s 0.05s, width 0.3s;
        }
        .nx-logo span { color: #7eb8d4; }
        .nx-sidebar.open .nx-logo { opacity: 1; width: 120px; }

        .nx-menu-btn {
          width: 44px; height: 44px;
          border-radius: 4px;
          border: 1px solid rgba(212,168,75,0.3);
          background: transparent;
          color: #d4a84b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .nx-menu-btn:hover { background: rgba(212,168,75,0.08); border-color: #d4a84b; }

        .nx-nav { display: flex; flex-direction: column; gap: 8px; flex: 1; }

        .nx-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid transparent;
          color: rgba(232,232,224,0.5);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.22s;
          white-space: nowrap;
          overflow: hidden;
        }
        .nx-nav-item:hover { background: rgba(212,168,75,0.08); color: #d4a84b; transform: translateX(2px); }
        .nx-nav-item.active {
          background: rgba(212,168,75,0.1);
          border-color: rgba(212,168,75,0.25);
          color: #d4a84b;
        }
        .nx-nav-item svg { flex-shrink: 0; }

        .nx-nav-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.2s 0.08s, width 0.3s;
        }
        .nx-sidebar.open .nx-nav-label { opacity: 1; width: auto; }

        .nx-logout { margin-top: auto; color: rgba(220,80,90,0.7) !important; }
        .nx-logout:hover { background: rgba(220,80,90,0.08) !important; color: #dc505a !important; }

        .nx-user-footer {
          padding: 16px 0 0;
          border-top: 1px solid rgba(212,168,75,0.1);
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(232,232,224,0.35);
          white-space: nowrap;
          overflow: hidden;
        }
        .nx-user-name {
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.2s 0.05s, width 0.3s;
          padding: 0 2px 8px;
        }
        .nx-sidebar.open .nx-user-name { opacity: 1; width: auto; }

        /* ── MAIN ── */
        .nx-main {
          flex: 1;
          margin-left: 80px;
          padding: 28px;
          min-height: 100vh;
          position: relative;
          z-index: 1;
          transition: margin-left 0.32s cubic-bezier(.4,0,.2,1);
        }
        .nx-sidebar.open ~ .nx-main { margin-left: 240px; }

        @media (max-width: 768px) {
          .nx-sidebar {
            transform: translateX(-100%);
            transition: transform 0.32s cubic-bezier(.4,0,.2,1), width 0.32s cubic-bezier(.4,0,.2,1);
          }
          .nx-sidebar.open {
            transform: translateX(0);
            width: 240px;
          }
          .nx-main { margin-left: 0 !important; padding: 16px; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`nx-sidebar ${open ? "open" : ""}`}>
        <div className="nx-sidebar-head">
          <div className="nx-logo">NEX<span>US</span></div>
          <button className="nx-menu-btn" onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="nx-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`nx-nav-item ${location.pathname.startsWith(path) ? "active" : ""}`}
            >
              <Icon size={20} />
              <span className="nx-nav-label">{label}</span>
            </Link>
          ))}

          <div className="nx-nav-item nx-logout" onClick={logout}>
            <LogOut size={20} />
            <span className="nx-nav-label">DISCONNECT</span>
          </div>
        </nav>

        <div className="nx-user-footer">
          <div className="nx-user-name">{user?.username}</div>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <main className="nx-main">{children}</main>
    </div>
  );
}