import { useEffect, useState } from "react";
import api from "../../services/api";

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
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Overview</h2>

      <p>
        Total Students: {statistics.totalStudents}
      </p>

      <p>
        Total Fees: Rs. {statistics.totalFee}
      </p>

      <p>
        Total Collection: Rs. {statistics.totalCollection}
      </p>

      <p>
        Total Pending: Rs. {statistics.totalPending}
      </p>

      <p>
        Today's Collection: Rs. {statistics.todayCollection}
      </p>

      <h2>Recent Payments</h2>

      {recentPayments.length === 0 ? (
        <p>No recent payments.</p>
      ) : (
        <ul>
          {recentPayments.map((payment) => (
            <li key={payment._id}>
              {payment.student.name} — {payment.feeType} — Rs.{" "}
              {payment.amount} — {payment.paymentMethod}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;