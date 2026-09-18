import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

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
        <h1>Admin Dashboard</h1>
        <p>Overview of your student fee management system</p>
      </div>

      <h2>Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{statistics.totalStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Total Fees</h3>
          <p>Rs. {statistics.totalFee}</p>
        </div>

        <div className="stat-card">
          <h3>Total Collection</h3>
          <p>Rs. {statistics.totalCollection}</p>
        </div>

        <div className="stat-card">
          <h3>Total Pending</h3>
          <p>Rs. {statistics.totalPending}</p>
        </div>

        <div className="stat-card">
          <h3>Today's Collection</h3>
          <p>Rs. {statistics.todayCollection}</p>
        </div>
      </div>

      <div className="recent-payments">
        <h2>Recent Payments</h2>

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
                 <td>{payment.student?.name || "Unknown Student"}</td>
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