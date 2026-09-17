import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Fee System</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
  <NavLink
    to="/admin/dashboard"
    className={({ isActive }) =>
      isActive ? "active" : ""
    }
  >
    Dashboard
  </NavLink>

  <NavLink
    to="/admin/students"
    className={({ isActive }) =>
      isActive ? "active" : ""
    }
  >
    Students
  </NavLink>

  <NavLink
    to="/admin/fees"
    className={({ isActive }) =>
      isActive ? "active" : ""
    }
  >
    Fee Management
  </NavLink>

  <NavLink
    to="/admin/payments"
    className={({ isActive }) =>
      isActive ? "active" : ""
    }
  >
    Payments
  </NavLink>
</nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;