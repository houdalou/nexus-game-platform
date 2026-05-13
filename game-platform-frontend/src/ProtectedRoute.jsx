import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, adminOnly = false, playerOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;

  try {
    decoded = jwtDecode(token);
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const role = decoded?.role || decoded?.roles || "";

  // normalize role
  const normalizedRole = role.replace("ROLE_", "");

  if (adminOnly && normalizedRole !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  if (playerOnly && normalizedRole === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}