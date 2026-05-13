import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;

const SHAPES = [
  { color: "#00f5ff", blocks: [[1,1,1,1]] },
  { color: "#ff6b35", blocks: [[1,1],[1,1]] },
  { color: "#a855f7", blocks: [[0,1,0],[1,1,1]] },
  { color: "#22c55e", blocks: [[1,1,0],[0,1,1]] },
  { color: "#ef4444", blocks: [[0,1,1],[1,1,0]] },
  { color: "#3b82f6", blocks: [[1,0,0],[1,1,1]] },
  { color: "#f59e0b", blocks: [[0,0,1],[1,1,1]] },
];

function rotate(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;
  const res = Array.from({ length: M }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < M; c++) {
      res[c][N - 1 - r] = matrix[r][c];
    }
  }
  return res;
}

function newPiece() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    x: Math.floor(COLS / 2) - 1,
    y: 0,
    blocks: shape.blocks.map(r => [...r]),
    color: shape.color
  };
}

export default function Tetris() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    piece: newPiece(),
    score: 0,
    lines: 0,
    over: false
  });

  /* 🎮 DRAW */
  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const ctx = cvs.getContext("2d");
    const s = stateRef.current;

    // DARK GAME BACKGROUND (less faded)
    ctx.fillStyle = "#05060a";
    ctx.fillRect(0, 0, W, H);

    // glow vignette (gives depth)
    const grd = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, H);
    grd.addColorStop(0, "rgba(0,245,255,0.05)");
    grd.addColorStop(1, "rgba(0,0,0,0.8)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // GRID (stronger visibility than before)
    ctx.strokeStyle = "rgba(0,245,255,0.06)";
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
      ctx.stroke();
    }

    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, H);
      ctx.stroke();
    }

    // BOARD BLOCKS (glow stronger)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (s.board[r][c]) {
          ctx.fillStyle = s.board[r][c];
          ctx.shadowColor = s.board[r][c];
          ctx.shadowBlur = 14;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          ctx.shadowBlur = 0;
        }
      }
    }

    // PIECE
    const p = s.piece;
    p.blocks.forEach((row, dy) => {
      row.forEach((v, dx) => {
        if (v) {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 18;

          ctx.fillRect(
            (p.x + dx) * CELL + 1,
            (p.y + dy) * CELL + 1,
            CELL - 2,
            CELL - 2
          );

          ctx.shadowBlur = 0;
        }
      });
    });
  }, []);

  /* GAME LOGIC */
  const isValid = (piece, board) => {
    for (let r = 0; r < piece.blocks.length; r++) {
      for (let c = 0; c < piece.blocks[r].length; c++) {
        if (piece.blocks[r][c]) {
          const nx = piece.x + c;
          const ny = piece.y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && board[ny][nx]) return false;
        }
      }
    }
    return true;
  };

  const lockPiece = (s) => {
    s.piece.blocks.forEach((row, dy) => {
      row.forEach((v, dx) => {
        if (v) {
          const ny = s.piece.y + dy;
          if (ny >= 0) s.board[ny][s.piece.x + dx] = s.piece.color;
        }
      });
    });
  };

  const clearLines = (s) => {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (s.board[r].every(c => c !== null)) {
        s.board.splice(r, 1);
        s.board.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }
    return cleared;
  };

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.over) return;

    const next = { ...s.piece, y: s.piece.y + 1 };

    if (isValid(next, s.board)) {
      s.piece = next;
    } else {
      lockPiece(s);
      const cleared = clearLines(s);

      if (cleared > 0) {
        s.lines += cleared;
        s.score += cleared * 120 * cleared;

        setLines(s.lines);
        setScore(s.score);
        setLevel(Math.floor(s.lines / 10) + 1);
      }

      s.piece = newPiece();

      if (!isValid(s.piece, s.board)) {
        s.over = true;
        setGameOver(true);
        return;
      }
    }

    draw();
  }, [draw]);

  useEffect(() => {
    draw();
    const speed = Math.max(80, 500 - (level - 1) * 45);
    const id = setInterval(gameLoop, speed);
    return () => clearInterval(id);
  }, [gameLoop, level]);

  useEffect(() => {
    const onKey = (e) => {
      if (!started) setStarted(true);

      const s = stateRef.current;
      if (s.over) return;

      if (e.key === "ArrowLeft") {
        const n = { ...s.piece, x: s.piece.x - 1 };
        if (isValid(n, s.board)) s.piece = n;
      }

      if (e.key === "ArrowRight") {
        const n = { ...s.piece, x: s.piece.x + 1 };
        if (isValid(n, s.board)) s.piece = n;
      }

      if (e.key === "ArrowDown") {
        const n = { ...s.piece, y: s.piece.y + 1 };
        if (isValid(n, s.board)) s.piece = n;
      }

      if (e.key === "ArrowUp" || e.key === " ") {
        const n = { ...s.piece, blocks: rotate(s.piece.blocks) };
        if (isValid(n, s.board)) s.piece = n;
      }

      draw();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, draw]);

  const reset = () => {
    stateRef.current = {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      piece: newPiece(),
      score: 0,
      lines: 0,
      over: false
    };

    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setStarted(false);
    draw();
  };

  const submitScore = async () => {
    try {
      await api.post(`/arcade/score?points=${score}&gameType=TETRIS`);
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="tetris-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tetris-page {
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:16px;
          background:#080a0e;
          color:#e8e8e0;
          font-family: 'Rajdhani', sans-serif;
          position:relative;
        }

        .tetris-page::before {
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

        .title {
          text-align:center;
          position: relative;
          z-index: 5;
        }

        .title h1 {
          margin:0;
          font-family:'Orbitron', monospace;
          font-size: 24px;
          font-weight: 900;
          color: #7eb8d4;
          text-shadow:0 0 30px rgba(126,184,212,0.4);
          letter-spacing:4px;
        }
        .title h1 span { color: #d4a84b; }

        .title p {
          margin:6px 0 0;
          font-size:11px;
          color: rgba(232,232,224,0.5);
          letter-spacing:2px;
          font-family: 'Share Tech Mono', monospace;
        }

        .hud {
          display:flex;
          gap:28px;
          font-family:'Share Tech Mono', monospace;
          font-size:12px;
          color: rgba(232,232,224,0.6);
          position: relative;
          z-index: 5;
        }

        .hud b {
          color: #d4a84b;
          font-weight:700;
        }

        .game-box {
          position:relative;
          border:1px solid rgba(126,184,212,0.3);
          border-radius:12px;
          box-shadow:0 0 60px rgba(126,184,212,0.15), inset 0 0 30px rgba(0,0,0,0.5);
          background: rgba(8,10,14,0.85);
          padding: 20px;
          backdrop-filter: blur(10px);
          z-index: 5;
        }

        canvas {
          display:block;
          border-radius: 8px;
        }

        .overlay {
          position:absolute;
          inset:20px;
          background:rgba(8,10,14,0.95);
          border-radius:8px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:16px;
          backdrop-filter: blur(10px);
        }

        .overlay h2 {
          color:#dc505a;
          font-family:'Orbitron', monospace;
          font-size: 28px;
          font-weight: 900;
          letter-spacing:4px;
          text-shadow:0 0 30px rgba(220,80,90,0.5);
          margin: 0;
        }

        .overlay p {
          font-family:'Share Tech Mono', monospace;
          font-size: 14px;
          color: rgba(232,232,224,0.7);
          margin: 0;
        }

        button {
          padding:12px 28px;
          border-radius:6px;
          border:1px solid rgba(126,184,212,0.3);
          background:linear-gradient(90deg, rgba(126,184,212,0.15), rgba(126,184,212,0.05));
          color:#7eb8d4;
          cursor:pointer;
          font-family:'Orbitron', monospace;
          font-size:11px;
          letter-spacing:2px;
          font-weight: 700;
          transition: all 0.2s;
        }

        button:hover {
          box-shadow:0 0 20px rgba(126,184,212,0.3);
          border-color: #7eb8d4;
        }

        button.danger {
          border-color: rgba(220,80,90,0.3);
          background: linear-gradient(90deg, rgba(220,80,90,0.15), rgba(220,80,90,0.05));
          color: #dc505a;
        }

        button.danger:hover {
          box-shadow:0 0 20px rgba(220,80,90,0.3);
          border-color: #dc505a;
        }
      `}</style>

      {/* TITLE */}
      <div className="title">
        <h1>TETRIS <span>PROTOCOL</span></h1>
        <p>ARROWS / WASD / SPACE</p>
      </div>

      {/* HUD */}
      <div className="hud">
        <span>SCORE <b>{score}</b></span>
        <span>LEVEL <b>{level}</b></span>
        <span>LINES <b>{lines}</b></span>
      </div>

      {/* CANVAS */}
      <div className="game-box">
        <canvas ref={canvasRef} width={W} height={H} />

        {/* OVERLAY */}
        {gameOver && (
          <div className="overlay">
            <h2>TERMINATED</h2>
            <p>FINAL SCORE: {score}</p>

            <button onClick={reset}>REBOOT</button>
            <button className="danger" onClick={submitScore}>UPLOAD</button>
            <button onClick={() => navigate("/dashboard")}>EXIT</button>
          </div>
        )}

        {!started && !gameOver && (
          <div className="overlay">
            <h2 style={{ color: "#7eb8d4", textShadow: "0 0 20px rgba(126,184,212,0.3)" }}>PRESS ANY KEY</h2>
          </div>
        )}
      </div>
    </div>
  );
}