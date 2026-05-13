import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const GRID = 20;
const CELL = 24;
const W = GRID * CELL;
const H = GRID * CELL;

function randFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function Snake() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem("snakeHigh") || "0")
  );
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    over: false,
  });

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const s = stateRef.current;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(0,240,255,0.05)";
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, H);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(W, i * CELL);
      ctx.stroke();
    }

    const fx = s.food.x * CELL;
    const fy = s.food.y * CELL;

    ctx.shadowColor = "#ff6b35";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ff6b35";
    ctx.fillRect(fx + 2, fy + 2, CELL - 4, CELL - 4);
    ctx.shadowBlur = 0;

    s.snake.forEach((seg, i) => {
      const sx = seg.x * CELL;
      const sy = seg.y * CELL;

      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = i === 0 ? 14 : 6;

      ctx.fillStyle = i === 0 ? "#00f0ff" : "rgba(0,240,255,0.55)";
      ctx.fillRect(sx + 1, sy + 1, CELL - 2, CELL - 2);

      ctx.shadowBlur = 0;
    });
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.over) return;

    const head = {
      x: s.snake[0].x + s.dir.x,
      y: s.snake[0].y + s.dir.y,
    };

    if (
      head.x < 0 ||
      head.x >= GRID ||
      head.y < 0 ||
      s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      s.over = true;
      setGameOver(true);

      setHighScore((prev) => {
        const next = Math.max(prev, s.score);
        localStorage.setItem("snakeHigh", String(next));
        return next;
      });
      return;
    }

    s.snake.unshift(head);

    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10;
      setScore(s.score);
      s.food = randFood(s.snake);
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  useEffect(() => {
    draw();
    const id = setInterval(gameLoop, 120);
    return () => clearInterval(id);
  }, [gameLoop, draw]);

  useEffect(() => {
    const onKey = (e) => {
      if (!started) setStarted(true);
      const s = stateRef.current;
      if (s.over) return;

      const k = e.key;

      if ((k === "ArrowUp" || k === "w") && s.dir.y === 0)
        s.dir = { x: 0, y: -1 };
      if ((k === "ArrowDown" || k === "s") && s.dir.y === 0)
        s.dir = { x: 0, y: 1 };
      if ((k === "ArrowLeft" || k === "a") && s.dir.x === 0)
        s.dir = { x: -1, y: 0 };
      if ((k === "ArrowRight" || k === "d") && s.dir.x === 0)
        s.dir = { x: 1, y: 0 };
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  const reset = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }],
      dir: { x: 1, y: 0 },
      food: randFood([{ x: 10, y: 10 }]),
      score: 0,
      over: false,
    };

    setScore(0);
    setGameOver(false);
    setStarted(false);
    draw();
  };

  const submitScore = async () => {
    try {
      await api.post("/arcade/score?points=" + score + "&gameType=SNAKE");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="snake-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .snake-page {
          min-height: 100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          background:#080a0e;
          font-family: 'Rajdhani', sans-serif;
          color: #e8e8e0;
          overflow:hidden;
          position:relative;
        }

        .snake-page::before {
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

        .snake-container {
          animation: slideIn 0.7s ease-out;
          transform-origin: right;
          position: relative;
          z-index: 5;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(120px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .arcade-frame {
          padding: 24px;
          border-radius: 12px;
          background: rgba(8,10,14,0.85);
          border: 1px solid rgba(126,184,212,0.2);
          box-shadow: 0 0 60px rgba(126,184,212,0.1), inset 0 0 30px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }

        .title {
          font-family: 'Orbitron', monospace;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #7eb8d4;
          margin-bottom: 16px;
          text-shadow: 0 0 30px rgba(126,184,212,0.4);
          text-align:center;
        }
        .title span { color: #d4a84b; }

        .hud {
          display:flex;
          justify-content:center;
          gap:32px;
          font-family: 'Share Tech Mono', monospace;
          font-size:12px;
          letter-spacing: 1px;
          color: rgba(232,232,224,0.6);
          margin-bottom:16px;
        }

        .val {
          color: #d4a84b;
          font-weight:700;
        }

        canvas {
          border-radius: 8px;
          border: 1px solid rgba(126,184,212,0.3);
          box-shadow: 0 0 40px rgba(126,184,212,0.15);
        }

        .overlay {
          position:absolute;
          inset:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          background:rgba(8,10,14,0.95);
          border-radius:8px;
          gap:16px;
          backdrop-filter: blur(10px);
        }

        .overlay h2 {
          font-family: 'Orbitron', monospace;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #dc505a;
          text-shadow: 0 0 30px rgba(220,80,90,0.5);
          margin: 0;
        }

        .overlay p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: rgba(232,232,224,0.7);
          margin: 0;
        }

        .btn {
          padding:12px 28px;
          border-radius:6px;
          border:1px solid rgba(126,184,212,0.3);
          background:linear-gradient(90deg, rgba(126,184,212,0.15), rgba(126,184,212,0.05));
          color:#7eb8d4;
          font-family:'Orbitron', monospace;
          font-size:11px;
          letter-spacing:2px;
          font-weight: 700;
          cursor:pointer;
          transition: all 0.2s;
        }

        .btn:hover {
          box-shadow:0 0 20px rgba(126,184,212,0.3);
          border-color: #7eb8d4;
        }

        .btn.danger {
          border-color: rgba(220,80,90,0.3);
          background: linear-gradient(90deg, rgba(220,80,90,0.15), rgba(220,80,90,0.05));
          color: #dc505a;
        }

        .btn.danger:hover {
          box-shadow:0 0 20px rgba(220,80,90,0.3);
          border-color: #dc505a;
        }
      `}</style>

      <div className="snake-container">
        <div className="title">SNAKE <span>PROTOCOL</span></div>

        <div className="hud">
          <div>SCORE: <span className="val">{score}</span></div>
          <div>HIGH: <span className="val">{highScore}</span></div>
        </div>

        <div className="arcade-frame" style={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
          />

          {gameOver && (
            <div className="overlay">
              <h2>TERMINATED</h2>
              <p>FINAL SCORE: {score}</p>

              <button className="btn" onClick={reset}>REBOOT</button>
              <button className="btn danger" onClick={submitScore}>
                UPLOAD
              </button>
              <button className="btn" onClick={() => navigate("/dashboard")}>
                EXIT
              </button>
            </div>
          )}

          {!started && !gameOver && (
            <div className="overlay">
              <p style={{ color: "rgba(232,232,224,0.5)" }}>
                PRESS ANY KEY TO START
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}