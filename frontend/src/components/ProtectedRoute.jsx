import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role
  if (role && user.role !== role) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;