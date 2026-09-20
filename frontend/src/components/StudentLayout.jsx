import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./StudentLayout.css";

function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="sidebar-header">
  <div style={{
    width: 36, height: 36, borderRadius: 10,
    background: "#2563eb", display: "flex",
    alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 16
  }}>
    F
  </div>
  <div>
    <h2>Fee System</h2>
    <p>Student Panel</p>
  </div>
</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            My Profile
          </NavLink>

          <NavLink
            to="/student/fees"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Fee Details
          </NavLink>

          <NavLink
            to="/student/payments"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Payment History
          </NavLink>

          <NavLink
            to="/student/settings"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Settings
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;