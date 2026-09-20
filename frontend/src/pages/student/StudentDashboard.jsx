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

  const paymentProgress =
    feeSummary.totalFee > 0
      ? Math.min(
          (feeSummary.totalPaid / feeSummary.totalFee) * 100,
          100
        )
      : 0;

  const latestPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="student-dashboard">

      {/* Header */}
      <div className="student-header">
        <div>
          <p className="portal-label">Student Portal</p>

          <h1>Dashboard</h1>

          <p>
            Manage your fees, payments and receipts from one place.
          </p>
        </div>

        <button
          type="button"
          className="student-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div className="welcome-card">
        <div className="welcome-content">
          <div className="student-avatar">
            {student.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="welcome-label">Welcome back 👋</p>

            <h2>{student.name}</h2>

            <div className="student-meta">
              <span>
                Student ID: <strong>{student.studentId}</strong>
              </span>

              <span>
                Class: <strong>{student.className}</strong>
              </span>

              <span>
                Section: <strong>{student.section}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="section-heading">
        <div>
          <h2>Fee Overview</h2>
          <p>Your current fee status</p>
        </div>
      </div>

      <div className="fee-summary-grid">

        <div className="fee-card">
          <div className="fee-card-icon blue-icon">
            ₹
          </div>

          <div>
            <p>Total Fee</p>
            <h3>Rs. {feeSummary.totalFee}</h3>
          </div>
        </div>

        <div className="fee-card">
          <div className="fee-card-icon green-icon">
            ✓
          </div>

          <div>
            <p>Total Paid</p>
            <h3>Rs. {feeSummary.totalPaid}</h3>
          </div>
        </div>

        <div className="fee-card">
          <div className="fee-card-icon red-icon">
            !
          </div>

          <div>
            <p>Outstanding</p>
            <h3>Rs. {feeSummary.outstanding}</h3>
          </div>
        </div>

        <div className="fee-card">
          <div className="fee-card-icon purple-icon">
            #
          </div>

          <div>
            <p>Payments Made</p>
            <h3>{payments.length}</h3>
          </div>
        </div>

      </div>

      {/* Payment Progress */}
      <div className="progress-card">

        <div className="progress-header">
          <div>
            <h2>Payment Progress</h2>
            <p>Your fee payment completion</p>
          </div>

          <strong>
            {Math.round(paymentProgress)}%
          </strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${paymentProgress}%`,
            }}
          />
        </div>

        <div className="progress-footer">
          <span>
            Paid: <strong>Rs. {feeSummary.totalPaid}</strong>
          </span>

          <span>
            Remaining:{" "}
            <strong>Rs. {feeSummary.outstanding}</strong>
          </span>
        </div>

      </div>

      {/* Main Grid */}
      <div className="student-main-grid">

        {/* Fee Breakdown */}
        <div className="fee-breakdown-card">

          <div className="breakdown-header">
            <div>
              <h2>Fee Breakdown</h2>
              <p>Your assigned fee structure</p>
            </div>
          </div>

          <div className="breakdown-list">

            <div className="breakdown-row">
              <span>Tuition Fee</span>
              <strong>
                Rs. {feeSummary.tuitionFee || 0}
              </strong>
            </div>

            <div className="breakdown-row">
              <span>Transport Fee</span>
              <strong>
                Rs. {feeSummary.transportFee || 0}
              </strong>
            </div>

            <div className="breakdown-row">
              <span>Exam Fee</span>
              <strong>
                Rs. {feeSummary.examFee || 0}
              </strong>
            </div>

            <div className="breakdown-row">
              <span>Other Fee</span>
              <strong>
                Rs. {feeSummary.otherFee || 0}
              </strong>
            </div>

          </div>

          <div className="breakdown-total">
            <span>Total Fee</span>

            <strong>
              Rs. {feeSummary.totalFee}
            </strong>
          </div>

        </div>

        {/* Latest Payment */}
        <div className="latest-payment-card">

          <div className="latest-payment-header">
            <div>
              <h2>Latest Payment</h2>
              <p>Your most recent transaction</p>
            </div>
          </div>

          {latestPayment ? (
            <div className="latest-payment-content">

              <div className="payment-check">
                ✓
              </div>

              <div className="latest-payment-info">

                <span className="latest-payment-type">
                  {latestPayment.feeType}
                </span>

                <h3>
                  Rs. {latestPayment.amount}
                </h3>

                <p>
                  {latestPayment.paymentMethod} •{" "}
                  {new Date(
                    latestPayment.paymentDate
                  ).toLocaleDateString()}
                </p>

              </div>

              <button
                className="latest-receipt-btn"
                onClick={() =>
                  handleDownloadReceipt(latestPayment._id)
                }
              >
                Receipt
              </button>

            </div>
          ) : (
            <div className="no-latest-payment">
              <p>No payments have been recorded yet.</p>
            </div>
          )}

        </div>

      </div>

      {/* Payment History */}
      <div className="payments-card">

        <div className="payments-header">
          <div>
            <h2>Payment History</h2>
            <p>View all your previous transactions</p>
          </div>

          <span>
            {payments.length} payment(s)
          </span>
        </div>

        {payments.length === 0 ? (
          <p className="no-payments">
            No payments found.
          </p>
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

                    <td>
                      <span className="fee-type-badge">
                        {payment.feeType}
                      </span>
                    </td>

                    <td className="payment-amount">
                      Rs. {payment.amount}
                    </td>

                    <td>
                      {payment.paymentMethod}
                    </td>

                    <td>
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="download-receipt-btn"
                        onClick={() =>
                          handleDownloadReceipt(payment._id)
                        }
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