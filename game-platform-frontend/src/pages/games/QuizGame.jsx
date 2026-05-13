import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function QuizGame() {
  const { category: difficulty } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [failedQuestion, setFailedQuestion] = useState(null);
  const [victory, setVictory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = async () => {
    try {
      const res = await api.post(`/quiz/start?difficulty=${difficulty}`);
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Error starting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (answered) return;
    setSelected(answer);
    setAnswered(true);

    if (answer.correct) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        const next = current + 1;
        if (next < questions.length) {
          setCurrent(next);
          setSelected(null);
          setAnswered(false);
        } else {
          setVictory(true);
          finishQuiz(newScore);
        }
      }, 800);
    } else {
      setTimeout(() => {
        setGameOver(true);
        setFailedQuestion({
          question: questions[current],
          selectedAnswer: answer,
          correctAnswer: questions[current].answers.find((a) => a.correct),
        });
      }, 600);
    }
  };

  const finishQuiz = async (finalScore) => {
    try {
      await api.post(`/quiz/end?sessionId=${sessionId}&correctAnswers=${finalScore}&timeLeft=0`);
    } catch (err) {
      console.error("Error ending quiz:", err);
    }
  };

  const getDifficultyColor = () => {
    if (difficulty === "EASY") return "#22c55e";
    if (difficulty === "MEDIUM") return "#f59e0b";
    return "#ef4444";
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "#080a0e", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .quiz-loading::before {
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
      `}</style>
      <div className="quiz-loading" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(126,184,212,0.3)", borderTopColor: "#7eb8d4", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "11px", letterSpacing: "3px", color: "rgba(232,232,224,0.5)" }}>LOADING PROTOCOL...</p>
      </div>
    </div>
  );

  if (!questions.length)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080a0e", color: "rgba(232,232,224,0.5)", fontFamily: "'Orbitron', monospace", fontSize: "14px", letterSpacing: "2px", position: "relative" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family/Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .quiz-no-data::before {
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
        `}</style>
        <div className="quiz-no-data" style={{ position: 'relative', zIndex: 5 }}>NO DATA FOUND</div>
      </div>
    );

  if (victory) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "20px", background: "#080a0e", textAlign: "center", position: "relative" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family/Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .quiz-victory::before {
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
          .victory-title { font-family:'Orbitron', monospace; font-size:28px; letter-spacing:4px; color:#7eb8d4; margin:0; text-shadow:0 0 30px rgba(126,184,212,0.3); animation:pulse 2s infinite; font-weight: 900; }
          .victory-sub { font-family:'Share Tech Mono', monospace; font-size:12px; letter-spacing:2px; color:rgba(232,232,224,0.5); margin:0; }
          .victory-score { font-family:'Orbitron', monospace; font-size:48px; font-weight:800; color:#d4a84b; margin:0; text-shadow:0 0 40px rgba(212,168,75,0.4); }
          .victory-btn { padding:12px 32px; border-radius:6px; border:1px solid rgba(126,184,212,0.3); background:linear-gradient(90deg, rgba(126,184,212,0.15), rgba(126,184,212,0.05)); color:#7eb8d4; font-family:'Orbitron', monospace; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all 0.2s; }
          .victory-btn:hover { box-shadow:0 0 20px rgba(126,184,212,0.3); border-color: #7eb8d4; }
          .victory-btn.secondary { border-color: rgba(126,184,212,0.2); color: rgba(232,232,224,0.5); background: transparent; }
          .victory-btn.secondary:hover { border-color: rgba(126,184,212,0.4); color: rgba(232,232,224,0.7); }
        `}</style>
        <div className="quiz-victory" style={{ position: 'relative', zIndex: 5 }}>
          <h1 className="victory-title">PROTOCOL COMPLETE</h1>
          <p className="victory-sub">ALL SYSTEMS FUNCTIONAL</p>
          <div className="victory-score">{score} / {questions.length}</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="victory-btn" onClick={() => window.location.reload()}>REPLAY //</button>
            <button className="victory-btn secondary" onClick={() => navigate("/dashboard")}>EXIT</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver && failedQuestion) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "20px", background: "#080a0e", textAlign: "center", position: "relative" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family:Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .quiz-gameover::before {
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
          .go-title { font-family:'Orbitron', monospace; font-size:24px; letter-spacing:4px; color:#dc505a; margin:0; text-shadow:0 0 24px rgba(220,80,90,0.3); font-weight: 900; }
          .go-sub { font-family:'Share Tech Mono', monospace; font-size:10px; letter-spacing:2px; color:rgba(232,232,224,0.5); margin:0; }
          .go-card { background:rgba(8,10,14,0.85); border:1px solid rgba(220,80,90,0.2); border-radius:12px; padding:28px; width:100%; max-width:520px; text-align:left; position:relative; overflow:hidden; backdrop-filter: blur(10px); }
          .go-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, #dc505a, transparent); opacity:0.5; }
          .go-label { font-family:'Share Tech Mono', monospace; font-size:9px; letter-spacing:2px; color:rgba(232,232,224,0.5); text-transform:uppercase; margin:0 0 8px; }
          .go-q { font-family:'Rajdhani', sans-serif; font-size:16px; color:#e8e8e0; margin:0 0 16px; line-height:1.5; }
          .go-ans { padding:10px 14px; border-radius:6px; margin-bottom:8px; font-family:'Rajdhani', sans-serif; font-size:14px; }
          .go-wrong { background:rgba(220,80,90,0.08); border:1px solid rgba(220,80,90,0.25); color:#dc505a; }
          .go-correct { background:rgba(126,184,212,0.06); border:1px solid rgba(126,184,212,0.2); color:#7eb8d4; }
          .go-btn { padding:10px 28px; border-radius:6px; border:1px solid rgba(126,184,212,0.3); background:linear-gradient(90deg, rgba(126,184,212,0.15), rgba(126,184,212,0.05)); color:#7eb8d4; font-family:'Orbitron', monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all 0.2s; }
          .go-btn:hover { box-shadow:0 0 20px rgba(126,184,212,0.3); border-color: #7eb8d4; }
          .go-btn.secondary { border-color: rgba(126,184,212,0.2); color: rgba(232,232,224,0.5); background: transparent; }
          .go-btn.secondary:hover { border-color: rgba(126,184,212,0.4); color: rgba(232,232,224,0.7); }
        `}</style>

        <div className="quiz-gameover" style={{ position: 'relative', zIndex: 5 }}>
          <h1 className="go-title">TERMINATED</h1>
          <p className="go-sub">SESSION ABORTED // QUESTION {String(current + 1).padStart(2, "0")}</p>

          <div className="go-card">
            <p className="go-label">Failed Protocol</p>
            <p className="go-q">{failedQuestion.question.questionText}</p>

            <p className="go-label">Your Answer</p>
            <div className="go-ans go-wrong">{failedQuestion.selectedAnswer.answerText}</div>

            <p className="go-label">Correct Answer</p>
            <div className="go-ans go-correct">{failedQuestion.correctAnswer.answerText}</div>

            <p className="go-label" style={{ marginTop: "16px" }}>Score Reached: {score} / {questions.length}</p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="go-btn" onClick={() => window.location.reload()}>RETRY //</button>
            <button className="go-btn secondary" onClick={() => navigate("/quiz")}>LEVEL SELECT</button>
            <button className="go-btn secondary" onClick={() => navigate("/dashboard")}>EXIT</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const diffColor = getDifficultyColor();

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#e8e8e0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .quiz-main::before {
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
        .qg-header { text-align:center; margin-bottom:20px; position: relative; z-index: 5; }
        .qg-title { font-family:'Orbitron', monospace; font-size:14px; letter-spacing:3px; color:#7eb8d4; margin:0; text-transform:uppercase; font-weight: 700; }
        .qg-diff { font-family:'Share Tech Mono', monospace; font-size:10px; letter-spacing:2px; margin-top:6px; }
        .qg-card { background:rgba(8,10,14,0.85); border:1px solid rgba(126,184,212,0.2); border-radius:12px; padding:28px; width:100%; max-width:520px; text-align:center; position:relative; overflow:hidden; backdrop-filter: blur(10px); z-index: 5; }
        .qg-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, #7eb8d4, transparent); opacity:0.4; }
        .qg-progress-bar { height:3px; background:rgba(255,255,255,0.05); border-radius:2px; margin-bottom:20px; overflow:hidden; }
        .qg-progress-fill { height:100%; background:linear-gradient(90deg, #7eb8d4, #d4a84b); transition:width 0.5s ease; }
        .qg-q { font-family:'Rajdhani', sans-serif; font-size:17px; margin:0 0 24px; color:#e8e8e0; line-height:1.5; }
        .qg-answers { display:flex; flex-direction:column; gap:10px; }
        .qg-btn { padding:12px; border-radius:6px; border:1px solid rgba(126,184,212,0.2); cursor:pointer; background:rgba(8,10,14,0.6); color:#e8e8e0; font-family:'Rajdhani', sans-serif; font-weight:600; font-size:15px; transition:all 0.2s; text-align:left; }
        .qg-btn:hover:not(:disabled) { border-color:rgba(126,184,212,0.4); background:rgba(126,184,212,0.08); }
        .qg-btn.selected-correct { border-color:rgba(126,184,212,0.5); background:rgba(126,184,212,0.1); color:#7eb8d4; }
        .qg-btn.selected-wrong { border-color:rgba(220,80,90,0.5); background:rgba(220,80,90,0.1); color:#dc505a; }
        .qg-btn:disabled { cursor:default; }
        .qg-footer { margin-top:16px; display:flex; justify-content:space-between; align-items:center; }
        .qg-footer-text { font-family:'Share Tech Mono', monospace; font-size:10px; letter-spacing:2px; color:rgba(232,232,224,0.5); }
        .qg-score { font-family:'Share Tech Mono', monospace; font-size:12px; color:#d4a84b; }
      `}</style>

      <div className="quiz-main" style={{ position: 'relative', zIndex: 5 }}>
        <div className="qg-header">
          <h2 className="qg-title">QUIZ PROTOCOL</h2>
          <p className="qg-diff" style={{ color: diffColor }}>DIFFICULTY: {difficulty}</p>
        </div>

        <div className="qg-card">
          <div className="qg-progress-bar">
            <div className="qg-progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
          </div>
          <h3 className="qg-q">{q.questionText}</h3>
          <div className="qg-answers">
            {q.answers?.map((a) => {
              let cls = "qg-btn";
              if (answered && selected?.id === a.id) {
                cls += a.correct ? " selected-correct" : " selected-wrong";
              }
              return (
                <button key={a.id} onClick={() => handleAnswer(a)} className={cls} disabled={answered}>
                  {a.answerText}
                </button>
              );
            })}
          </div>
          <div className="qg-footer">
            <span className="qg-footer-text">QUESTION {String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
            <span className="qg-score">SCORE: {score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}