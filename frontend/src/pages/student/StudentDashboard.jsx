import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load student dashboard"
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

  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>Welcome, {dashboard.student.name}</h2>

      <h2>Fee Summary</h2>

      <p>
        Total Fee: Rs. {dashboard.feeSummary.totalFee}
      </p>

      <p>
        Total Paid: Rs. {dashboard.feeSummary.totalPaid}
      </p>

      <p>
        Outstanding: Rs. {dashboard.feeSummary.outstanding}
      </p>

      <h2>Payment History</h2>

      {dashboard.payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul>
          {dashboard.payments.map((payment) => (
            <li key={payment._id}>
              {payment.feeType} — Rs. {payment.amount} —{" "}
              {payment.paymentMethod}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentDashboard;