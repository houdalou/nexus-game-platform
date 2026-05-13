import { Routes, Route } from "react-router-dom";

// PUBLIC
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/user/Home";

// USER
import Dashboard from "../pages/user/Dashboard";
import Games from "../pages/user/Games";
import Rankings from "../pages/user/Rankings";
import Achievements from "../pages/user/Achievements";
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";

// GAMES
import QuizStart from "../pages/user/QuizStart";
import QuizGame from "../pages/games/QuizGame";
import Snake from "../pages/games/Snake";
import Tetris from "../pages/games/Tetris";
import Chess from "../pages/games/Chess";

// ADMIN
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminGames from "../pages/admin/AdminGames";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminActivities from "../pages/admin/AdminActivities";

import ProtectedRoute from "../ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER */}
      <Route path="/dashboard" element={<ProtectedRoute playerOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute playerOnly><Games /></ProtectedRoute>} />
      <Route path="/rankings" element={<ProtectedRoute playerOnly><Rankings /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute playerOnly><Achievements /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute playerOnly><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute playerOnly><Settings /></ProtectedRoute>} />

      {/* GAMES */}
      <Route path="/quiz" element={<ProtectedRoute playerOnly><QuizStart /></ProtectedRoute>} />
      <Route path="/quiz/play/:category" element={<ProtectedRoute playerOnly><QuizGame /></ProtectedRoute>} />
      <Route path="/snake" element={<ProtectedRoute playerOnly><Snake /></ProtectedRoute>} />
      <Route path="/tetris" element={<ProtectedRoute playerOnly><Tetris /></ProtectedRoute>} />
      <Route path="/chess" element={<ProtectedRoute playerOnly><Chess /></ProtectedRoute>} />

      {/* ADMIN */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/games" element={<ProtectedRoute adminOnly><AdminGames /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/activities" element={<ProtectedRoute adminOnly><AdminActivities /></ProtectedRoute>} />

    </Routes>
  );
}