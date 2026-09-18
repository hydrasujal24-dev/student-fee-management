import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load admin dashboard"
        );
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  const { statistics, recentPayments } = dashboard;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Overview of your student fee management system
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            className="dashboard-action-btn primary"
            onClick={() => navigate("/admin/students/add")}
          >
            + Add Student
          </button>

          <button
            className="dashboard-action-btn"
            onClick={() => navigate("/admin/fees")}
          >
            Manage Fees
          </button>

          <button
            className="dashboard-action-btn"
            onClick={() => navigate("/admin/payments")}
          >
            Record Payment
          </button>
        </div>
      </div>

      <h2>Overview</h2>

      <div className="stats-grid">
        <button
          className="stat-card stat-card-button"
          onClick={() => navigate("/admin/students")}
        >
          <h3>Total Students</h3>
          <p>{statistics.totalStudents}</p>
          <span>View students →</span>
        </button>

        <button
          className="stat-card stat-card-button"
          onClick={() => navigate("/admin/fees")}
        >
          <h3>Total Fees</h3>
          <p>Rs. {statistics.totalFee}</p>
          <span>Manage fees →</span>
        </button>

        <button
          className="stat-card stat-card-button"
          onClick={() => navigate("/admin/payments")}
        >
          <h3>Total Collection</h3>
          <p>Rs. {statistics.totalCollection}</p>
          <span>View payments →</span>
        </button>

        <button
          className="stat-card stat-card-button"
          onClick={() => navigate("/admin/payments")}
        >
          <h3>Total Pending</h3>
          <p>Rs. {statistics.totalPending}</p>
          <span>View payments →</span>
        </button>

        <button
          className="stat-card stat-card-button"
          onClick={() => navigate("/admin/payments")}
        >
          <h3>Today's Collection</h3>
          <p>Rs. {statistics.todayCollection}</p>
          <span>View payments →</span>
        </button>
      </div>

      <div className="recent-payments">
        <div className="recent-payments-header">
          <h2>Recent Payments</h2>

          <button
            className="view-all-btn"
            onClick={() => navigate("/admin/payments")}
          >
            View All
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <p>No recent payments.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Receipt</th>
              </tr>
            </thead>

            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    {payment.student?.name ||
                      "Unknown Student"}
                  </td>

                  <td>{payment.feeType}</td>

                  <td>Rs. {payment.amount}</td>

                  <td>{payment.paymentMethod}</td>

                  <td>{payment.receiptNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;