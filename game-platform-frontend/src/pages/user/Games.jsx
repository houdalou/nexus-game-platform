import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Play, Filter, Gamepad2, Star } from "lucide-react";
import gameService from "../../services/gameService";
import Layout from "../../components/Layout";

const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];
const CATEGORIES = ["ALL", "ARCADE", "QUIZ", "CHESS", "MEMORY"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Games() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameService.getAll()
      .then((res) => setGames(res.data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = games.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "ALL" || (g.difficulty || "MEDIUM").toUpperCase() === difficulty;
    const matchCat = category === "ALL" || (g.category || "ARCADE").toUpperCase() === category;
    return matchSearch && matchDiff && matchCat;
  });

  const handlePlay = (game) => {
    const cat = game.category?.toUpperCase();
    const slug = game.slug;
    if (cat === "QUIZ") navigate("/quiz");
    else if (cat === "ARCADE") {
      if (slug === "snake") navigate("/snake");
      else if (slug === "tetris") navigate("/tetris");
      else alert("Coming soon");
    } else if (cat === "CHESS") {
      if (slug === "chess") navigate("/chess");
      else alert("Coming soon");
    } else alert("Coming soon");
  };

  const getDifficultyColor = (d) => {
    switch ((d || "MEDIUM").toUpperCase()) {
      case "EASY": return "var(--green)";
      case "HARD": return "var(--pink)";
      default: return "var(--amber)";
    }
  };

  const getCategoryIcon = (cat) => {
    switch ((cat || "ARCADE").toUpperCase()) {
      case "QUIZ": return "◎";
      case "ARCADE": return "▣";
      case "CHESS": return "◈";
      case "MEMORY": return "◇";
      default: return "▣";
    }
  };

  return (
    <Layout>
      <div className="games-page">
        <style>{`
          .games-page { animation: fadeIn 0.5s ease; }
          .games-header { margin-bottom:32px; }
          .games-title { font-family:var(--font-display); font-size:28px; font-weight:700; color:var(--cyan); margin:0 0 8px; text-shadow:0 0 20px rgba(0,240,255,0.15); }
          .games-sub { color:var(--text-dim); font-size:13px; margin:0; }
          .games-filters { display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; align-items:center; }
          .search-box { position:relative; flex:1; min-width:240px; }
          .search-box input {
            width:100%; padding:12px 16px 12px 44px; border-radius:var(--radius);
            border:1px solid var(--border-dim); background:var(--bg-card);
            color:var(--text); font-family:var(--font-body); font-size:14px;
            outline:none; transition:all 0.2s;
          }
          .search-box input:focus { border-color:var(--border); box-shadow:0 0 0 2px rgba(0,240,255,0.1), 0 0 18px rgba(0,240,255,0.08); }
          .search-box svg { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-dim); pointer-events:none; }
          .filter-group { display:flex; gap:6px; }
          .filter-chip {
            padding:8px 14px; border-radius:8px; border:1px solid var(--border-dim);
            background:var(--bg-card); color:var(--text-dim); font-size:11px;
            font-family:var(--font-display); letter-spacing:1px; cursor:pointer;
            transition:all 0.2s; text-transform:uppercase;
          }
          .filter-chip:hover { border-color:var(--border); color:var(--text); }
          .filter-chip.active { border-color:var(--cyan); color:var(--cyan); background:rgba(0,240,255,0.06); }
          .games-grid-page {
            display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));
            gap:20px;
          }
          .game-card-page {
            background:var(--bg-card); border:1px solid var(--border-dim);
            border-radius:var(--radius); padding:20px; position:relative;
            overflow:hidden; transition:all 0.3s ease; backdrop-filter:blur(14px);
          }
          .game-card-page::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
            opacity:0; transition:opacity 0.3s;
          }
          .game-card-page:hover {
            transform:translateY(-6px); border-color:var(--border);
            box-shadow:var(--glow-cyan);
          }
          .game-card-page:hover::before { opacity:1; }
          .game-icon-page {
            width:48px; height:48px; border-radius:12px;
            background:rgba(0,240,255,0.08); border:1px solid rgba(0,240,255,0.15);
            display:flex; align-items:center; justify-content:center;
            color:var(--cyan); font-family:var(--font-display); font-size:20px;
            margin-bottom:14px;
          }
          .game-title-page {
            font-family:var(--font-display); font-size:16px; font-weight:600;
            color:var(--text); margin:0 0 8px;
          }
          .game-desc-page {
            font-size:13px; color:var(--text-dim); line-height:1.5; margin:0 0 14px;
            min-height:40px;
          }
          .game-meta-page { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
          .game-tag-page {
            font-size:10px; font-family:var(--font-display); letter-spacing:1px;
            padding:3px 10px; border-radius:6px; text-transform:uppercase;
          }
          .game-tag-page.difficulty { background:rgba(255,255,255,0.03); border:1px solid var(--border-dim); }
          .game-xp-page {
            display:flex; align-items:center; gap:4px;
            font-size:11px; color:var(--amber); font-family:var(--font-display);
            margin-bottom:12px;
          }
          .game-play-page {
            width:100%; padding:10px; border-radius:8px;
            border:1px solid rgba(0,240,255,0.2);
            background:rgba(0,240,255,0.06); color:var(--cyan);
            font-family:var(--font-display); font-size:11px;
            letter-spacing:2px; cursor:pointer; transition:all 0.2s;
            display:flex; align-items:center; justify-content:center; gap:6px;
          }
          .game-play-page:hover { background:rgba(0,240,255,0.12); box-shadow:0 0 16px rgba(0,240,255,0.1); }
          .empty-games { text-align:center; padding:60px 20px; color:var(--text-dim); }
          .loading-games { display:flex; justify-content:center; padding:80px; }
        `}</style>

        <div className="games-header">
          <h1 className="games-title">GAMES CATALOG</h1>
          <p className="games-sub">// SELECT YOUR CHALLENGE</p>
        </div>

        <div className="games-filters">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`filter-chip ${difficulty === d ? "active" : ""}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="filter-group">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-chip ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-games">
            <div style={{ width: 40, height: 40, border: "2px solid var(--border-dim)", borderTopColor: "var(--cyan)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <motion.div
            className="games-grid-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((game, i) => (
              <motion.div key={game.id || i} className="game-card-page" variants={itemVariants}>
                <div className="game-icon-page">{getCategoryIcon(game.category)}</div>
                <h3 className="game-title-page">{game.title}</h3>
                <p className="game-desc-page">{game.description || "Classic arcade action. Test your skills."}</p>
                <div className="game-meta-page">
                  <span className="game-tag-page" style={{ background: "rgba(0,240,255,0.06)", color: "var(--cyan)", border: "1px solid rgba(0,240,255,0.15)" }}>
                    {game.category || "ARCADE"}
                  </span>
                  <span className="game-tag-page difficulty" style={{ color: getDifficultyColor(game.difficulty) }}>
                    {game.difficulty || "MEDIUM"}
                  </span>
                </div>
                <div className="game-xp-page">
                  <Star size={12} /> +{game.xpReward || "50"} XP
                </div>
                <button className="game-play-page" onClick={() => handlePlay(game)}>
                  <Play size={14} /> PLAY NOW
                </button>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-games" style={{ gridColumn: "1 / -1" }}>
                <Gamepad2 size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p>No games found matching your filters.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
