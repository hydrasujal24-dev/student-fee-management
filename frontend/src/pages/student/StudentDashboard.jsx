import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./StudentDashboard.css";


function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
const navigate = useNavigate();

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

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};

  if (error) {
    return (
      <div className="student-dashboard">
        <p className="student-error">{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="student-dashboard">
        <p className="student-loading">Loading dashboard...</p>
      </div>
    );
  }

  const { student, feeSummary, payments } = dashboard;
  

const handleDownloadReceipt = async (paymentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/receipts/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${paymentId}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to download receipt"
    );
  }
};


  return (
    <div className="student-dashboard">
     <div className="student-header">
  <div>
    <h1>Student Dashboard</h1>
    <p>View your fee information and payment history</p>
  </div>

  <button
    type="button"
    className="student-logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

      <div className="welcome-card">
        <div>
          <p className="welcome-label">Welcome back</p>
          <h2>{student.name}</h2>
          <p className="student-info">
            Student ID: {student.studentId}
          </p>
        </div>
      </div>

      <h2 className="section-title">Fee Summary</h2>

      <div className="fee-summary-grid">
        <div className="fee-card">
          <p>Total Fee</p>
          <h3>Rs. {feeSummary.totalFee}</h3>
        </div>

        <div className="fee-card">
          <p>Total Paid</p>
          <h3>Rs. {feeSummary.totalPaid}</h3>
        </div>

        <div className="fee-card outstanding-card">
          <p>Outstanding</p>
          <h3>Rs. {feeSummary.outstanding}</h3>
        </div>
      </div>
<div className="payments-card">
  <div className="payments-header">
    <h2>Payment History</h2>
    <span>{payments.length} payment(s)</span>
  </div>

  {payments.length === 0 ? (
    <p className="no-payments">No payments found.</p>
  ) : (
    <div className="payment-table-wrapper">
      <table className="payment-table">
        <thead>
          <tr>
            <th>Fee Type</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Receipt</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.feeType}</td>

              <td className="payment-amount">
                Rs. {payment.amount}
              </td>

              <td>{payment.paymentMethod}</td>

              <td>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </td>
               



              <td>
                <button
                  className="download-receipt-btn"
                  onClick={() => handleDownloadReceipt(payment._id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
    </div>
  );
}

export default StudentDashboard;