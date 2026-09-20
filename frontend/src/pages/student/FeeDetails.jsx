import { useEffect, useState } from "react";
import api from "../../services/api";
import "./FeeDetails.css";

function FeeDetails() {
  const [feeSummary, setFeeSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeeSummary(response.data.feeSummary);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load fee details"
        );
      }
    };

    fetchFeeDetails();
  }, []);

  if (error) {
    return (
      <div className="fee-details">
        <div className="fee-details-error">{error}</div>
      </div>
    );
  }

  if (!feeSummary) {
    return (
      <div className="fee-details">
        <div className="fee-details-loading">
          Loading fee details...
        </div>
      </div>
    );
  }

  const paymentProgress =
    feeSummary.totalFee > 0
      ? Math.min(
          (feeSummary.totalPaid / feeSummary.totalFee) * 100,
          100
        )
      : 0;

  const isFullyPaid = feeSummary.outstanding <= 0;

  return (
    <div className="fee-details">
      {/* Header */}
      <div className="fee-details-header">
        <div>
          <p className="fee-details-label">Student Portal</p>
          <h1>Fee Details</h1>
          <p>
            View your assigned fees, payments and outstanding balance.
          </p>
        </div>
      </div>

      {/* Main Summary */}
      <div className="fee-main-summary">
        <div className="fee-summary-left">
          <div className="fee-summary-icon">₹</div>

          <div>
            <p>Total Fee</p>
            <h2>Rs. {feeSummary.totalFee}</h2>
            <span>
              {isFullyPaid
                ? "All fees have been paid"
                : "Fee payment is in progress"}
            </span>
          </div>
        </div>

        <div
          className={`fee-status ${
            isFullyPaid ? "paid-status" : "pending-status"
          }`}
        >
          <span className="fee-status-dot">●</span>
          {isFullyPaid ? "Fully Paid" : "Payment Pending"}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="fee-overview-grid">
        <div className="fee-overview-card">
          <div className="fee-overview-icon total-icon">₹</div>
          <div>
            <span>Total Fee</span>
            <strong>Rs. {feeSummary.totalFee}</strong>
          </div>
        </div>

        <div className="fee-overview-card">
          <div className="fee-overview-icon paid-icon">✓</div>
          <div>
            <span>Total Paid</span>
            <strong>Rs. {feeSummary.totalPaid}</strong>
          </div>
        </div>

        <div className="fee-overview-card">
          <div className="fee-overview-icon due-icon">!</div>
          <div>
            <span>Outstanding</span>
            <strong>Rs. {feeSummary.outstanding}</strong>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="fee-progress-card">
        <div className="fee-progress-header">
          <div>
            <h2>Payment Progress</h2>
            <p>Overall fee payment completion</p>
          </div>

          <strong>{Math.round(paymentProgress)}%</strong>
        </div>

        <div className="fee-progress-track">
          <div
            className="fee-progress-fill"
            style={{ width: `${paymentProgress}%` }}
          />
        </div>

        <div className="fee-progress-footer">
          <span>
            Paid <strong>Rs. {feeSummary.totalPaid}</strong>
          </span>

          <span>
            Remaining <strong>Rs. {feeSummary.outstanding}</strong>
          </span>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="fee-structure-card">
        <div className="fee-structure-header">
          <div>
            <h2>Assigned Fee Structure</h2>
            <p>Breakdown of your current academic fees</p>
          </div>

          <span className="fee-structure-badge">
            Current
          </span>
        </div>

        <div className="fee-structure-list">
          <div className="fee-structure-row">
            <div className="fee-name">
              <div className="fee-row-icon tuition-icon">
                T
              </div>

              <div>
                <strong>Tuition Fee</strong>
                <span>Academic / semester fee</span>
              </div>
            </div>

            <strong>
              Rs. {feeSummary.tuitionFee || 0}
            </strong>
          </div>

          <div className="fee-structure-row">
            <div className="fee-name">
              <div className="fee-row-icon transport-icon">
                B
              </div>

              <div>
                <strong>Transport Fee</strong>
                <span>Transportation service</span>
              </div>
            </div>

            <strong>
              Rs. {feeSummary.transportFee || 0}
            </strong>
          </div>

          <div className="fee-structure-row">
            <div className="fee-name">
              <div className="fee-row-icon exam-icon">
                E
              </div>

              <div>
                <strong>Exam Fee</strong>
                <span>Examination related fee</span>
              </div>
            </div>

            <strong>
              Rs. {feeSummary.examFee || 0}
            </strong>
          </div>

          <div className="fee-structure-row">
            <div className="fee-name">
              <div className="fee-row-icon other-icon">
                +
              </div>

              <div>
                <strong>Other Fee</strong>
                <span>Additional charges</span>
              </div>
            </div>

            <strong>
              Rs. {feeSummary.otherFee || 0}
            </strong>
          </div>
        </div>

        <div className="fee-total-row">
          <span>Total Assigned Fee</span>
          <strong>Rs. {feeSummary.totalFee}</strong>
        </div>
      </div>

      {/* Payment Status */}
      <div className="fee-status-card">
        <div className="fee-status-card-icon">
          {isFullyPaid ? "✓" : "!"}
        </div>

        <div>
          <h2>
            {isFullyPaid
              ? "Your fees are fully paid"
              : "Outstanding balance"}
          </h2>

          <p>
            {isFullyPaid
              ? "You currently have no outstanding fee balance."
              : `You have Rs. ${feeSummary.outstanding} remaining to complete your fee payment.`}
          </p>
        </div>

        <div className="fee-status-amount">
          <span>Balance</span>
          <strong>
            Rs. {feeSummary.outstanding}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default FeeDetails;