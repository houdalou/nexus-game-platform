import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const SIZE = 64;
const W = 8 * SIZE;
const H = 8 * SIZE;

const PIECES = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
};

const START = [
  "rnbqkbnr",
  "pppppppp",
  "........",
  "........",
  "........",
  "........",
  "PPPPPPPP",
  "RNBQKBNR",
];

function cloneBoard(b) { return b.map((r) => [...r]); }

function isWhite(ch) { return ch && ch === ch.toUpperCase(); }
function isBlack(ch) { return ch && ch === ch.toLowerCase(); }
function sameColor(a, b) { return (isWhite(a) && isWhite(b)) || (isBlack(a) && isBlack(b)); }

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getLegalMoves(board, r, c) {
  const p = board[r][c];
  if (p === ".") return [];
  const white = isWhite(p);
  const moves = [];
  const add = (dr, dc) => { if (inBounds(dr, dc) && !sameColor(p, board[dr][dc])) moves.push([dr, dc]); };

  const slide = (dirs) => {
    for (const [dr, dc] of dirs) {
      let tr = r + dr, tc = c + dc;
      while (inBounds(tr, tc)) {
        if (board[tr][tc] === ".") { moves.push([tr, tc]); tr += dr; tc += dc; }
        else { if (!sameColor(p, board[tr][tc])) moves.push([tr, tc]); break; }
      }
    }
  };

  const ch = p.toLowerCase();
  if (ch === "p") {
    const dir = white ? -1 : 1;
    const startRow = white ? 6 : 1;
    // Single move
    if (inBounds(r + dir, c) && board[r + dir][c] === ".") {
      moves.push([r + dir, c]);
      // Double move - must check BOTH squares are empty
      if (r === startRow && board[r + dir * 2][c] === ".") moves.push([r + dir * 2, c]);
    }
    // Captures
    for (const dc of [-1, 1]) {
      const tr = r + dir, tc = c + dc;
      if (inBounds(tr, tc) && board[tr][tc] !== "." && !sameColor(p, board[tr][tc])) moves.push([tr, tc]);
    }
  } else if (ch === "n") {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r + dr, c + dc);
  } else if (ch === "b") {
    slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
  } else if (ch === "r") {
    slide([[-1,0],[1,0],[0,-1],[0,1]]);
  } else if (ch === "q") {
    slide([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
  } else if (ch === "k") {
    for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r + dr, c + dc);
  }
  return moves;
}

function findKing(board, white) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === (white ? "K" : "k")) return [r, c];
  return null;
}

function isCheck(board, white) {
  const king = findKing(board, white);
  if (!king) return false;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] !== "." && isWhite(board[r][c]) !== white)
        if (getLegalMoves(board, r, c).some(([tr, tc]) => tr === king[0] && tc === king[1]))
          return true;
  return false;
}

function isCheckmate(board, white) {
  if (!isCheck(board, white)) return false;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] !== "." && isWhite(board[r][c]) === white) {
        for (const [tr, tc] of getLegalMoves(board, r, c)) {
          const next = cloneBoard(board);
          next[tr][tc] = next[r][c]; next[r][c] = ".";
          if (!isCheck(next, white)) return false;
        }
      }
  return true;
}

function aiMove(board) {
  const moves = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (isBlack(board[r][c]))
        for (const [tr, tc] of getLegalMoves(board, r, c)) {
          moves.push({ from: [r, c], to: [tr, tc] });
        }
  
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export default function Chess() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [turn, setTurn] = useState("white");
  const [status, setStatus] = useState("YOUR TURN");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameMode, setGameMode] = useState("ai"); // "ai" or "2player"
  const [lastAiMove, setLastAiMove] = useState(null); // Track AI move for highlighting
  const stateRef = useRef({ board: START.map((r) => r.split("")), over: false });

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const s = stateRef.current;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const dark = (r + c) % 2 === 1;
        ctx.fillStyle = dark ? "#111118" : "#1a1a24";
        ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
        
        // Highlight selected piece
        if (selected && selected[0] === r && selected[1] === c) {
          ctx.fillStyle = "rgba(126,184,212,0.3)";
          ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
        }
        
        // Highlight AI's last move
        if (lastAiMove) {
          const [fromR, fromC] = lastAiMove.from;
          const [toR, toC] = lastAiMove.to;
          if ((r === fromR && c === fromC) || (r === toR && c === toC)) {
            ctx.fillStyle = "rgba(220,80,90,0.3)";
            ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
            // Draw arrow indicator for the move
            if (r === fromR && c === fromC) {
              ctx.strokeStyle = "rgba(220,80,90,0.8)";
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(c * SIZE + SIZE/2, r * SIZE + SIZE/2);
              ctx.lineTo(toC * SIZE + SIZE/2, toR * SIZE + SIZE/2);
              ctx.stroke();
            }
          }
        }
        
        // Highlight legal moves
        if (legalMoves.some(([tr, tc]) => tr === r && tc === c)) {
          ctx.fillStyle = s.board[r][c] !== "." 
            ? "rgba(220,80,90,0.4)"  // Capture - red
            : "rgba(34,197,94,0.3)";   // Move - green
          ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
          // Draw a dot for empty squares
          if (s.board[r][c] === ".") {
            ctx.beginPath();
            ctx.arc(c * SIZE + SIZE/2, r * SIZE + SIZE/2, 8, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(34,197,94,0.8)";
            ctx.fill();
          }
        }
        const p = s.board[r][c];
        if (p !== ".") {
          ctx.font = "40px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = isWhite(p) ? "#e0e0e0" : "#888";
          ctx.fillText(PIECES[p], c * SIZE + SIZE / 2, r * SIZE + SIZE / 2 + 2);
        }
      }
    }
    // border
    ctx.strokeStyle = "rgba(126,184,212,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, W, H);
  }, [selected, legalMoves, lastAiMove]);

  useEffect(() => { draw(); }, [draw]);

  const doAi = useCallback(() => {
    if (gameMode !== "ai") return;
    
    const s = stateRef.current;
    const move = aiMove(s.board);
    
    if (!move) {
      if (isCheck(s.board, false)) { setStatus("CHECKMATE // YOU WIN"); setResult("win"); }
      else { setStatus("STALEMATE // DRAW"); setResult("draw"); }
      s.over = true; setGameOver(true); return;
    }
    const [fr, fc] = move.from, [tr, tc] = move.to;
    s.board[tr][tc] = s.board[fr][fc]; s.board[fr][fc] = ".";
    
    setLastAiMove({ from: [fr, fc], to: [tr, tc] });
    
    if (isCheckmate(s.board, true)) { setStatus("CHECKMATE // YOU LOSE"); setResult("loss"); s.over = true; setGameOver(true); return; }
    if (isCheck(s.board, true)) setStatus("CHECK! YOUR TURN");
    else setStatus("YOUR TURN");
    setTurn("white");
    draw();
  }, [gameMode]);

  // Trigger AI when turn changes to black in AI mode
  useEffect(() => {
    if (gameMode === "ai" && turn === "black" && !gameOver) {
      const timer = setTimeout(() => {
        doAi();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, gameOver, doAi]);

  const handleClick = (e) => {
    const s = stateRef.current;
    if (s.over) return;
    
    // In AI mode, only allow white to play
    // In 2-player mode, allow current turn player to play
    const isWhiteTurn = turn === "white";
    if (gameMode === "ai" && !isWhiteTurn) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / SIZE);
    const r = Math.floor((e.clientY - rect.top) / SIZE);
    if (!inBounds(r, c)) return;

    // Clear AI move highlight when player makes a move
    setLastAiMove(null);

    // Check if clicking on own piece
    const clickedPiece = s.board[r][c];
    const isOwnPiece = clickedPiece !== "." && 
                       (isWhiteTurn ? isWhite(clickedPiece) : isBlack(clickedPiece));

    if (selected) {
      const [sr, sc] = selected;
      const legal = getLegalMoves(s.board, sr, sc);
      if (legal.some(([tr, tc]) => tr === r && tc === c)) {
        const next = cloneBoard(s.board);
        next[r][c] = next[sr][sc]; next[sr][sc] = ".";
        const currentColor = isWhiteTurn;
        
        if (!isCheck(next, currentColor)) {
          s.board = next;
          setSelected(null);
          setLegalMoves([]);
          setMoves((m) => m + 1);
          
          const nextTurn = currentColor ? "black" : "white";
          const opponentColor = !currentColor;
          
          // Check for checkmate/check on opponent
          if (isCheckmate(s.board, opponentColor)) {
            const winner = currentColor ? "white" : "black";
            if (gameMode === "ai") {
              setStatus(winner === "white" ? "CHECKMATE // YOU WIN" : "CHECKMATE // YOU LOSE");
              setResult(winner === "white" ? "win" : "loss");
            } else {
              setStatus(`CHECKMATE // ${winner.toUpperCase()} WINS`);
              setResult(winner === "white" ? "white" : "black");
            }
            s.over = true; setGameOver(true); draw(); return;
          }
          
          if (isCheck(s.board, opponentColor)) {
            setStatus("CHECK!");
          } else {
            setStatus(gameMode === "ai" ? (currentColor ? "AI THINKING..." : "YOUR TURN") : `${nextTurn.toUpperCase()}'S TURN`);
          }
          
          setTurn(nextTurn);
          draw();
          return;
        }
      }
      setSelected(null);
      setLegalMoves([]);
      if (isOwnPiece) {
        setSelected([r, c]);
        setLegalMoves(getLegalMoves(s.board, r, c));
      }
    } else {
      if (isOwnPiece) {
        setSelected([r, c]);
        setLegalMoves(getLegalMoves(s.board, r, c));
      }
    }
    draw();
  };

  const reset = () => {
    stateRef.current = { board: START.map((r) => r.split("")), over: false };
    setSelected(null); setLegalMoves([]); setTurn("white"); 
    setStatus(gameMode === "ai" ? "YOUR TURN" : "WHITE'S TURN"); 
    setGameOver(false); setResult(null); setMoves(0);
    setLastAiMove(null);
    draw();
  };

  const submitScore = async () => {
    const points = result === "win" ? 100 : result === "draw" ? 50 : 10;
    try { await api.post("/arcade/score?points=" + points + "&gameType=CHESS"); navigate("/dashboard"); }
    catch (err) { console.error(err); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "24px", background: "#080a0e", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .chess-wrapper {
          position: relative;
          z-index: 5;
          animation: slideIn 0.7s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(120px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        .chess-page::before {
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

        .chess-hud { display:flex; gap:28px; align-items:center; margin-bottom:16px; }
        .chess-hud-item { font-family:'Share Tech Mono', monospace; font-size:12px; letter-spacing:1px; color:rgba(232,232,224,0.6); }
        .chess-hud-val { color:#d4a84b; font-weight:700; }
        .chess-mode-toggle { display:flex; gap:8px; margin-bottom:16px; justify-content:center; }
        .chess-mode-btn { padding:8px 16px; border-radius:6px; border:1px solid rgba(126,184,212,0.3); background:transparent; color:rgba(232,232,224,0.5); font-family:'Share Tech Mono', monospace; font-size:11px; letter-spacing:1px; cursor:pointer; transition:all 0.2s; }
        .chess-mode-btn.active { background:rgba(126,184,212,0.15); border-color:#7eb8d4; color:#7eb8d4; }
        .chess-mode-btn:hover { background:rgba(126,184,212,0.08); border-color:rgba(126,184,212,0.5); }
        .chess-canvas { border:1px solid rgba(126,184,212,0.3); border-radius:12px; box-shadow:0 0 60px rgba(126,184,212,0.15), inset 0 0 30px rgba(0,0,0,0.5); background: rgba(8,10,14,0.85); padding: 16px; backdrop-filter: blur(10px); cursor:pointer; }
        .chess-over { position:absolute; inset:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(8,10,14,0.95); border-radius:8px; gap:16px; backdrop-filter: blur(10px); }
        .chess-btn { padding:12px 28px; border-radius:6px; border:1px solid rgba(126,184,212,0.3); background:linear-gradient(90deg, rgba(126,184,212,0.15), rgba(126,184,212,0.05)); color:#7eb8d4; font-family:'Orbitron', monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .chess-btn:hover { box-shadow:0 0 20px rgba(126,184,212,0.3); border-color: #7eb8d4; }
        .chess-btn.danger { border-color: rgba(220,80,90,0.3); background: linear-gradient(90deg, rgba(220,80,90,0.15), rgba(220,80,90,0.05)); color: #dc505a; }
        .chess-btn.danger:hover { box-shadow:0 0 20px rgba(220,80,90,0.3); border-color: #dc505a; }
      `}</style>

      <div className="chess-wrapper">
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: "24px", letterSpacing: "4px", color: "#7eb8d4", margin: 0, textShadow: "0 0 30px rgba(126,184,212,0.4)", fontWeight: 900 }}>CHESS <span style={{ color: "#d4a84b" }}>PROTOCOL</span></h1>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "2px", color: "rgba(232,232,224,0.5)", margin: "8px 0 0" }}>{gameMode === "ai" ? "WHITE VS ROBOT" : "WHITE VS BLACK"} // CLICK PIECE THEN DESTINATION</p>
        </div>

        <div className="chess-mode-toggle">
          <button 
            className={`chess-mode-btn ${gameMode === "ai" ? "active" : ""}`}
            onClick={() => { setGameMode("ai"); reset(); }}
          >
            VS ROBOT
          </button>
          <button 
            className={`chess-mode-btn ${gameMode === "2player" ? "active" : ""}`}
            onClick={() => { setGameMode("2player"); reset(); }}
          >
            2 PLAYER
          </button>
        </div>

        <div className="chess-hud">
          <div className="chess-hud-item">STATUS: <span className="chess-hud-val">{status}</span></div>
          <div className="chess-hud-item">MOVES: <span className="chess-hud-val">{moves}</span></div>
        </div>

        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} width={W} height={H} className="chess-canvas" onClick={handleClick} />
          {gameOver && (
            <div className="chess-over">
              <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "28px", color: result === "win" ? "#7eb8d4" : result === "draw" ? "#e8e8e0" : "#dc505a", letterSpacing: "3px", margin: 0, fontWeight: 900, textShadow: result === "win" ? "0 0 30px rgba(126,184,212,0.5)" : result === "draw" ? "none" : "0 0 30px rgba(220,80,90,0.5)" }}>
                {result === "win" ? "WHITE WINS" : result === "loss" ? "BLACK WINS" : "DRAW"}
              </p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "14px", color: "rgba(232,232,224,0.7)", margin: 0 }}>
                {gameMode === "ai" 
                  ? (result === "win" ? "YOU DEFEATED THE ROBOT" : result === "loss" ? "ROBOT DEFEATED YOU" : "STALEMATE")
                  : (result === "white" ? "WHITE PLAYER WINS" : result === "black" ? "BLACK PLAYER WINS" : "STALEMATE")
                }
              </p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "12px", color: "rgba(232,232,224,0.5)", margin: "8px 0 0" }}>MOVES: {moves}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="chess-btn" onClick={reset}>REBOOT</button>
                <button className="chess-btn danger" onClick={submitScore}>UPLOAD //</button>
              </div>
              <button className="chess-btn" onClick={() => navigate("/dashboard")} style={{ borderColor: "rgba(126,184,212,0.2)", color: "rgba(232,232,224,0.5)", background: "transparent" }}>EXIT TO DASHBOARD</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
