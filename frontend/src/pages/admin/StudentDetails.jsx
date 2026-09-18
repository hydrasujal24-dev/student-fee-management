import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./StudentDetails.css";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/students/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDetails(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load student details"
        );
      }
    };

    fetchDetails();
  }, [id]);

  if (error) {
    return (
      <div className="student-details-page">
        <div className="details-error">{error}</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="student-details-page">
        <p className="details-loading">
          Loading student details...
        </p>
      </div>
    );
  }

  const {
    student,
    fee,
    feeSummary,
    payments,
  } = details;

  return (
    <div className="student-details-page">
      <div className="details-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/students")}
          >
            ← Back to Students
          </button>

          <h1>Student Details</h1>
          <p>View student information and fee records</p>
        </div>
      </div>

      {/* Student Information */}
      <div className="details-card">
        <div className="card-title">
          <div>
            <h2>{student.name}</h2>
            <p>Student ID: {student.studentId}</p>
          </div>

          <span
            className={
              student.hasAccount
                ? "account-badge active"
                : "account-badge"
            }
          >
            {student.hasAccount
              ? "Account Active"
              : "No Account"}
          </span>
        </div>

        <div className="student-info-grid">
          <div>
            <span>Email</span>
            <strong>{student.email}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{student.phone}</strong>
          </div>

          <div>
            <span>Class</span>
            <strong>
              {student.className} - {student.section}
            </strong>
          </div>

          <div>
            <span>Address</span>
            <strong>{student.address}</strong>
          </div>

          <div>
            <span>Parent Name</span>
            <strong>{student.parentName}</strong>
          </div>

          <div>
            <span>Parent Phone</span>
            <strong>{student.parentPhone}</strong>
          </div>

          {student.hasAccount && (
            <div>
              <span>Login Email</span>
              <strong>{student.accountEmail}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Fee Summary */}
      <h2 className="details-section-title">
        Fee Summary
      </h2>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Total Fee</span>
          <strong>Rs. {feeSummary.totalFee}</strong>
        </div>

        <div className="summary-card">
          <span>Total Paid</span>
          <strong>Rs. {feeSummary.totalPaid}</strong>
        </div>

        <div className="summary-card outstanding-summary">
          <span>Outstanding</span>
          <strong>Rs. {feeSummary.outstanding}</strong>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="details-card">
        <div className="card-heading">
          <h2>Fee Breakdown</h2>
        </div>

        {!fee ? (
          <p className="empty-message">
            No fee structure has been assigned to this student.
          </p>
        ) : (
          <div className="fee-breakdown">
            <div>
              <span>Tuition Fee</span>
              <strong>Rs. {fee.tuitionFee}</strong>
            </div>

            <div>
              <span>Transport Fee</span>
              <strong>Rs. {fee.transportFee}</strong>
            </div>

            <div>
              <span>Exam Fee</span>
              <strong>Rs. {fee.examFee}</strong>
            </div>

            <div>
              <span>Other Fee</span>
              <strong>Rs. {fee.otherFee}</strong>
            </div>

            <div className="fee-total">
              <span>Total</span>
              <strong>Rs. {fee.totalFee}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="details-card">
        <div className="card-heading">
          <h2>Payment History</h2>
          <span>
            {payments.length} payment(s)
          </span>
        </div>

        {payments.length === 0 ? (
          <p className="empty-message">
            No payments found for this student.
          </p>
        ) : (
          <div className="details-table-wrapper">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Receipt</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span className="receipt-number">
                        {payment.receiptNumber}
                      </span>
                    </td>

                    <td>{payment.feeType}</td>

                    <td className="payment-amount">
                      Rs. {payment.amount}
                    </td>

                    <td>{payment.paymentMethod}</td>

                    <td>
                      {payment.remarks || "-"}
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

export default StudentDetails;