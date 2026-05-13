import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post("/auth/login", form);

      // Check if user is banned (backend returns error for banned users)
      if (res.data?.message && res.data.message.toLowerCase().includes("banned")) {
        setStatus({
          type: "error",
          msg: "YOUR ACCOUNT IS BANNED",
        });
        return;
      }

      // Check if user is banned field
      if (res.data?.banned) {
        setStatus({
          type: "error",
          msg: "YOUR ACCOUNT IS BANNED",
        });
        return;
      }

      const token =
        res.data?.token ||
        res.data?.jwt ||
        res.data?.accessToken ||
        res.data;

      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);

      setStatus({ type: "success", msg: "ACCESS GRANTED" });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "AUTH FAILED";
      if (errorMsg.toLowerCase().includes("banned") || err.response?.status === 403) {
        setStatus({
          type: "error",
          msg: "YOUR ACCOUNT IS BANNED",
        });
      } else {
        setStatus({
          type: "error",
          msg: errorMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');

        /* 🔥 GLOBAL FIX (THIS REMOVES WHITE SPACE) */
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #080a0e;
          overflow: hidden;
        }

        .login-page {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #080a0e;
          font-family: 'Rajdhani', sans-serif;
          color: #e8e8e0;
          position: relative;
        }

        .login-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,75,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126,184,212,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .login-card {
          width: 380px;
          padding: 32px;
          border-radius: 10px;
          background: rgba(10,12,20,0.85);
          border: 1px solid rgba(212,168,75,0.15);
          box-shadow: 0 0 40px rgba(212,168,75,0.08);
          position: relative;
          z-index: 2;
        }

        .login-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4a84b, #7eb8d4, transparent);
        }

        .title {
          font-family: 'Orbitron', monospace;
          font-size: 26px;
          text-align: center;
          letter-spacing: 4px;
          color: #d4a84b;
          margin-bottom: 6px;
        }

        .subtitle {
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(126,184,212,0.7);
          margin-bottom: 24px;
        }

        .status {
          text-align: center;
          font-size: 12px;
          margin-bottom: 14px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 2px;
        }

        .error { color: #dc505a; }
        .success { color: #7eb8d4; }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border-radius: 6px;
          border: 1px solid rgba(212,168,75,0.15);
          background: rgba(0,0,0,0.5);
          color: #e8e8e0;
          outline: none;
        }

        input:focus {
          border-color: #d4a84b;
          box-shadow: 0 0 12px rgba(212,168,75,0.2);
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Orbitron', monospace;
          letter-spacing: 3px;
          font-size: 12px;
          border: none;
          margin-top: 10px;
        }

        .btn-primary {
          background: #d4a84b;
          color: #080a0e;
          font-weight: 700;
        }

        .btn-primary:hover {
          background: #e0b85a;
          box-shadow: 0 0 25px rgba(212,168,75,0.25);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(126,184,212,0.3);
          color: #7eb8d4;
        }

        .toggle {
          font-size: 11px;
          background: none;
          border: none;
          color: rgba(232,232,224,0.5);
          cursor: pointer;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="login-card">
        <div className="title">NEXUS</div>
        <div className="subtitle">// OPERATOR LOGIN</div>

        {status && (
          <div className={`status ${status.type}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            name="username"
            placeholder="USERNAME"
            onChange={handleChange}
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="PASSWORD"
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "HIDE PASSWORD" : "SHOW PASSWORD"}
          </button>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "CONNECTING..." : "LOGIN"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}