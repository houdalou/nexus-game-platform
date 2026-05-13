import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const GRID = 20;
const CELL = 24;
const W = GRID * CELL;
const H = GRID * CELL;

function randFood(snake, obstacles = [], bombs = []) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    obstacles.some((o) => o.x === pos.x && o.y === pos.y) ||
    bombs.some((b) => b.x === pos.x && b.y === pos.y)
  );
  return pos;
}

function randObstacle(snake, food, existingObstacles = [], bombs = []) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    (food && food.x === pos.x && food.y === pos.y) ||
    existingObstacles.some((o) => o.x === pos.x && o.y === pos.y) ||
    bombs.some((b) => b.x === pos.x && b.y === pos.y)
  );
  return pos;
}

function randBomb(snake, food, obstacles = [], existingBombs = []) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    (food && food.x === pos.x && food.y === pos.y) ||
    obstacles.some((o) => o.x === pos.x && o.y === pos.y) ||
    existingBombs.some((b) => b.x === pos.x && b.y === pos.y)
  );
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
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("medium"); // easy, medium, hard
  const [obstacles, setObstacles] = useState([]);
  const [bombs, setBombs] = useState([]);

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

    // Draw obstacles (blocks)
    obstacles.forEach((obs) => {
      const ox = obs.x * CELL;
      const oy = obs.y * CELL;
      ctx.shadowColor = "#888";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#444";
      ctx.fillRect(ox + 1, oy + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
      
      // Add X pattern on obstacle
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 4, oy + 4);
      ctx.lineTo(ox + CELL - 4, oy + CELL - 4);
      ctx.moveTo(ox + CELL - 4, oy + 4);
      ctx.lineTo(ox + 4, oy + CELL - 4);
      ctx.stroke();
    });

    // Draw bombs
    bombs.forEach((bomb) => {
      const bx = bomb.x * CELL;
      const by = bomb.y * CELL;
      ctx.shadowColor = "#dc505a";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#dc505a";
      ctx.beginPath();
      ctx.arc(bx + CELL/2, by + CELL/2, CELL/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Add fuse effect
      ctx.strokeStyle = "#ff9900";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + CELL/2, by + CELL/2);
      ctx.lineTo(bx + CELL/2 + 6, by + CELL/2 - 6);
      ctx.stroke();
    });

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
  }, [obstacles, bombs]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.over || paused) return;

    const head = {
      x: s.snake[0].x + s.dir.x,
      y: s.snake[0].y + s.dir.y,
    };

    // Wrap around walls instead of dying
    if (head.x < 0) head.x = GRID - 1;
    if (head.x >= GRID) head.x = 0;
    if (head.y < 0) head.y = GRID - 1;
    if (head.y >= GRID) head.y = 0;

    // Check collision with snake
    if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      s.over = true;
      setGameOver(true);

      setHighScore((prev) => {
        const next = Math.max(prev, s.score);
        localStorage.setItem("snakeHigh", String(next));
        return next;
      });
      return;
    }

    // Check collision with bombs - instant game over
    if (bombs.some((b) => b.x === head.x && b.y === head.y)) {
      s.over = true;
      setGameOver(true);

      setHighScore((prev) => {
        const next = Math.max(prev, s.score);
        localStorage.setItem("snakeHigh", String(next));
        return next;
      });
      return;
    }

    // Check collision with obstacles - instant game over
    if (obstacles.some((o) => o.x === head.x && o.y === head.y)) {
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
      s.score += 10 * level;
      setScore(s.score);
      s.food = randFood(s.snake, obstacles, bombs);
      
      // Level up every 50 points
      const newLevel = Math.floor(s.score / 50) + 1;
      if (newLevel !== level) {
        setLevel(newLevel);
        // Increase speed (decrease interval) based on difficulty
        const speedMap = { easy: 20, medium: 15, hard: 10 };
        const speedDecrease = speedMap[difficulty] || 15;
        setSpeed((prev) => Math.max(60, prev - speedDecrease));
        
        // Add obstacles after level 1 (2 obstacles per level)
        if (newLevel > 1) {
          const newObstacles = [...obstacles];
          for (let i = 0; i < 2; i++) {
            newObstacles.push(randObstacle(s.snake, s.food, newObstacles, bombs));
          }
          setObstacles(newObstacles);
        }
        
        // Add bombs randomly (1 bomb every 2 levels after level 2)
        if (newLevel >= 3 && newLevel % 2 === 0) {
          const newBombs = [...bombs];
          newBombs.push(randBomb(s.snake, s.food, obstacles, newBombs));
          setBombs(newBombs);
        }
      }
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw, paused, level, difficulty, obstacles, bombs]);

  useEffect(() => {
    draw();
    const id = setInterval(gameLoop, speed);
    return () => clearInterval(id);
  }, [gameLoop, draw, speed]);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      
      // Pause with Space or P
      if ((k === " " || k === "p" || k === "P") && started && !gameOver) {
        setPaused((prev) => !prev);
        return;
      }
      
      if (!started) {
        setStarted(true);
        setPaused(false);
      }
      
      if (paused) return;
      
      const s = stateRef.current;
      if (s.over) return;

      if ((k === "ArrowUp" || k === "w" || k === "W") && s.dir.y === 0)
        s.dir = { x: 0, y: -1 };
      if ((k === "ArrowDown" || k === "s" || k === "S") && s.dir.y === 0)
        s.dir = { x: 0, y: 1 };
      if ((k === "ArrowLeft" || k === "a" || k === "A") && s.dir.x === 0)
        s.dir = { x: -1, y: 0 };
      if ((k === "ArrowRight" || k === "d" || k === "D") && s.dir.x === 0)
        s.dir = { x: 1, y: 0 };
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, paused, gameOver]);

  const reset = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }],
      dir: { x: 1, y: 0 },
      food: randFood([{ x: 10, y: 10 }], [], []),
      score: 0,
      over: false,
    };

    setScore(0);
    setGameOver(false);
    setStarted(false);
    setPaused(false);
    setLevel(1);
    setObstacles([]);
    setBombs([]);
    
    // Reset speed based on difficulty
    const speedMap = { easy: 180, medium: 150, hard: 100 };
    setSpeed(speedMap[difficulty] || 150);
    
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
          gap:24px;
          font-family: 'Share Tech Mono', monospace;
          font-size:12px;
          letter-spacing: 1px;
          color: rgba(232,232,224,0.6);
          margin-bottom:16px;
          flex-wrap:wrap;
        }

        .controls-hint {
          text-align:center;
          font-family:'Share Tech Mono', monospace;
          font-size:11px;
          color:rgba(232,232,224,0.4);
          margin-top:12px;
        }

        .difficulty-toggle {
          display:flex;
          gap:8px;
          margin-bottom:16px;
          justify-content:center;
        }

        .diff-btn {
          padding:6px 14px;
          border-radius:4px;
          border:1px solid rgba(126,184,212,0.3);
          background:transparent;
          color:rgba(232,232,224,0.5);
          font-family:'Share Tech Mono', monospace;
          font-size:10px;
          letter-spacing:1px;
          cursor:pointer;
          transition:all 0.2s;
        }

        .diff-btn.active {
          background:rgba(126,184,212,0.15);
          border-color:#7eb8d4;
          color:#7eb8d4;
        }

        .diff-btn:hover {
          background:rgba(126,184,212,0.08);
          border-color:rgba(126,184,212,0.5);
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

        <div className="difficulty-toggle">
          <button 
            className={`diff-btn ${difficulty === "easy" ? "active" : ""}`}
            onClick={() => { setDifficulty("easy"); reset(); }}
          >
            EASY
          </button>
          <button 
            className={`diff-btn ${difficulty === "medium" ? "active" : ""}`}
            onClick={() => { setDifficulty("medium"); reset(); }}
          >
            MEDIUM
          </button>
          <button 
            className={`diff-btn ${difficulty === "hard" ? "active" : ""}`}
            onClick={() => { setDifficulty("hard"); reset(); }}
          >
            HARD
          </button>
        </div>

        <div className="hud">
          <div>SCORE: <span className="val">{score}</span></div>
          <div>HIGH: <span className="val">{highScore}</span></div>
          <div>LEVEL: <span className="val">{level}</span></div>
          <div>SPEED: <span className="val">{speed}ms</span></div>
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
              <p style={{ color: "rgba(232,232,224,0.5)", fontSize: "12px" }}>LEVEL REACHED: {level}</p>

              <button className="btn" onClick={reset}>REBOOT</button>
              <button className="btn danger" onClick={submitScore}>
                UPLOAD
              </button>
              <button className="btn" onClick={() => navigate("/dashboard")}>
                EXIT
              </button>
            </div>
          )}

          {paused && started && !gameOver && (
            <div className="overlay">
              <p style={{ color: "rgba(126,184,212,0.8)", fontFamily: "'Orbitron', monospace", fontSize: "20px", letterSpacing: "3px", fontWeight: 700 }}>
                PAUSED
              </p>
              <p style={{ color: "rgba(232,232,224,0.5)", fontFamily: "'Share Tech Mono', monospace", fontSize: "12px" }}>
                PRESS SPACE TO RESUME
              </p>
            </div>
          )}

          {!started && !gameOver && (
            <div className="overlay">
              <p style={{ color: "rgba(232,232,224,0.5)", fontFamily: "'Share Tech Mono', monospace", fontSize: "14px" }}>
                PRESS ANY KEY TO START
              </p>
              <p style={{ color: "rgba(232,232,224,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", marginTop: "8px" }}>
                WASD or ARROW KEYS to move<br/>
                SPACE to pause
              </p>
            </div>
          )}
        </div>
        <div className="controls-hint">
          WASD / ARROWS to move | SPACE to pause
        </div>
      </div>
    </div>
  );
}