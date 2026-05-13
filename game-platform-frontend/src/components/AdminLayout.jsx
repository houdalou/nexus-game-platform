import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Gamepad2, Users, BarChart3,
  Settings, ArrowLeft, Menu, X, Shield, Activity, LogOut,
} from "lucide-react";
import api from "../api/axios";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",  path: "/admin"            },
  { icon: Users,           label: "Users",      path: "/admin/users"      },
  { icon: Gamepad2,        label: "Games",      path: "/admin/games"      },
  { icon: BarChart3,       label: "Analytics",  path: "/admin/analytics"  },
  { icon: Activity,        label: "Activities", path: "/admin/activities" },
  { icon: Settings,        label: "Settings",   path: "/admin/settings"   },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser]   = useState(null);
  const [open, setOpen]   = useState(false);

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

  if (!user) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#06080f",
    }}>
      <style>{`@keyframes _sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: 32, height: 32,
        border: "1.5px solid rgba(126,184,212,0.15)",
        borderTopColor: "#7eb8d4",
        borderRadius: "50%",
        animation: "_sp 0.9s linear infinite",
      }} />
    </div>
  );

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <div className="adm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .adm-root{
          display:flex;min-height:100vh;
          font-family:'Inter',system-ui,sans-serif;
          background:#06080f;color:#d8dde8;
          position:relative;
        }
        .adm-root::before{
          content:'';position:fixed;inset:0;
          background-image:
            linear-gradient(rgba(126,184,212,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(126,184,212,0.025) 1px,transparent 1px);
          background-size:56px 56px;
          pointer-events:none;z-index:0;
        }

        /* SIDEBAR */
        .adm-sidebar{
          width:68px;
          background:rgba(8,11,20,0.97);
          border-right:1px solid rgba(255,255,255,0.06);
          position:fixed;left:0;top:0;bottom:0;
          z-index:200;
          padding:16px 12px;
          display:flex;flex-direction:column;
          transition:width 0.3s cubic-bezier(.4,0,.2,1);
          overflow:hidden;
        }
        .adm-sidebar.open{width:224px}

        .adm-head{
          display:flex;align-items:center;
          justify-content:space-between;
          margin-bottom:28px;min-height:44px;
        }
        .adm-logo{
          display:flex;align-items:center;gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:12px;font-weight:500;
          letter-spacing:3px;
          color:#7eb8d4;
          white-space:nowrap;opacity:0;width:0;overflow:hidden;
          transition:opacity 0.2s 0.06s,width 0.3s;
        }
        .adm-sidebar.open .adm-logo{opacity:1;width:140px}

        .adm-menu-btn{
          width:44px;height:44px;border-radius:10px;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.04);
          color:rgba(200,210,220,0.6);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;
          transition:background 0.2s,color 0.2s;
        }
        .adm-menu-btn:hover{background:rgba(126,184,212,0.12);color:#7eb8d4}

        .adm-nav{display:flex;flex-direction:column;gap:4px;flex:1}

        .adm-nav-item{
          display:flex;align-items:center;gap:12px;
          padding:12px;border-radius:10px;
          border:1px solid transparent;
          color:rgba(200,210,220,0.4);
          text-decoration:none;cursor:pointer;
          transition:all 0.2s;white-space:nowrap;overflow:hidden;
        }
        .adm-nav-item:hover{background:rgba(126,184,212,0.07);color:rgba(200,210,220,0.75);border-color:rgba(126,184,212,0.1)}
        .adm-nav-item.active{background:rgba(126,184,212,0.1);border-color:rgba(126,184,212,0.2);color:#7eb8d4}
        .adm-nav-item svg{flex-shrink:0}
        .adm-nav-label{
          font-size:13px;font-weight:500;
          opacity:0;width:0;overflow:hidden;
          transition:opacity 0.18s 0.06s,width 0.3s;
        }
        .adm-sidebar.open .adm-nav-label{opacity:1;width:auto}

        .adm-footer{
          margin-top:auto;
          padding-top:12px;
          border-top:1px solid rgba(255,255,255,0.05);
          display:flex;flex-direction:column;gap:4px;
        }
        .adm-back{
          display:flex;align-items:center;gap:12px;
          padding:12px;border-radius:10px;
          border:1px solid transparent;
          color:rgba(200,210,220,0.35);
          text-decoration:none;
          font-size:13px;font-weight:500;
          white-space:nowrap;overflow:hidden;
          transition:all 0.2s;
        }
        .adm-back:hover{color:rgba(200,210,220,0.7);background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.07)}
        .adm-back svg{flex-shrink:0}
        .adm-logout:hover{background:rgba(220,80,90,0.08)!important;color:#e05c68!important;border-color:rgba(220,80,90,0.15)!important}

        /* MAIN */
        .adm-main{
          flex:1;
          margin-left:68px;
          padding:28px 32px;
          position:relative;z-index:5;
          transition:margin-left 0.3s cubic-bezier(.4,0,.2,1);
        }
        .adm-sidebar.open ~ .adm-main{margin-left:224px}

        @media(max-width:768px){
          .adm-main{padding:18px;margin-left:68px!important}
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`adm-sidebar ${open ? "open" : ""}`}>
        <div className="adm-head">
          <div className="adm-logo">
            <Shield size={14} />
            ADMIN
          </div>
          <button className="adm-menu-btn" onClick={() => setOpen(o => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="adm-nav">
          {ADMIN_NAV.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`adm-nav-item ${location.pathname === path ? "active" : ""}`}
            >
              <Icon size={18} />
              <span className="adm-nav-label">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="adm-footer">
          <Link to="/dashboard" className="adm-back">
            <ArrowLeft size={18} />
            <span className="adm-nav-label">Player view</span>
          </Link>
          <div className={`adm-back adm-logout`} onClick={logout} style={{ cursor: "pointer" }}>
            <LogOut size={18} />
            <span className="adm-nav-label">Sign out</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="adm-main">{children}</main>
    </div>
  );
}