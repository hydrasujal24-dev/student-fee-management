import { useEffect, useState } from "react";
import api from "../../services/api";
import "./PaymentHistory.css";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(response.data.payments || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load payment history"
        );
      }
    };

    fetchPayments();
  }, []);

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
      <div className="payment-history">
        <div className="payment-history-error">{error}</div>
      </div>
    );
  }

  if (!payments) {
    return (
      <div className="payment-history">
        <div className="payment-history-loading">
          Loading payment history...
        </div>
      </div>
    );
  }

  const totalPaid = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const latestPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="payment-history">
      {/* Header */}
      <div className="payment-history-header">
        <div>
          <p className="payment-history-label">Student Portal</p>
          <h1>Payment History</h1>
          <p>
            View your previous transactions and download receipts.
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="payment-overview-grid">
        <div className="payment-overview-card">
          <div className="payment-overview-icon blue-payment-icon">
            #
          </div>

          <div>
            <span>Total Payments</span>
            <strong>{payments.length}</strong>
            <small>Recorded transactions</small>
          </div>
        </div>

        <div className="payment-overview-card">
          <div className="payment-overview-icon green-payment-icon">
            ✓
          </div>

          <div>
            <span>Total Amount Paid</span>
            <strong>Rs. {totalPaid}</strong>
            <small>Successful payments</small>
          </div>
        </div>

        <div className="payment-overview-card">
          <div className="payment-overview-icon purple-payment-icon">
            ₹
          </div>

          <div>
            <span>Latest Payment</span>
            <strong>
              {latestPayment
                ? `Rs. ${latestPayment.amount}`
                : "—"}
            </strong>

            <small>
              {latestPayment
                ? new Date(
                    latestPayment.paymentDate
                  ).toLocaleDateString()
                : "No payment yet"}
            </small>
          </div>
        </div>
      </div>

      {/* Latest Payment */}
      {latestPayment && (
        <div className="latest-payment-banner">
          <div className="latest-payment-banner-icon">
            ✓
          </div>

          <div className="latest-payment-banner-info">
            <span>Most Recent Transaction</span>
            <h2>
              {latestPayment.feeType} Fee — Rs.{" "}
              {latestPayment.amount}
            </h2>

            <p>
              Paid via {latestPayment.paymentMethod} on{" "}
              {new Date(
                latestPayment.paymentDate
              ).toLocaleDateString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDownloadReceipt(latestPayment._id)
            }
          >
            Download Receipt
          </button>
        </div>
      )}

      {/* Transaction Table */}
      <div className="payment-history-card">
        <div className="payment-history-card-header">
          <div>
            <h2>Transaction History</h2>
            <p>
              A complete record of your fee payments
            </p>
          </div>

          <span className="transaction-count">
            {payments.length}{" "}
            {payments.length === 1
              ? "Transaction"
              : "Transactions"}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="payment-empty-state">
            <div className="payment-empty-icon">₹</div>
            <h3>No payments yet</h3>
            <p>
              Your payment transactions will appear here
              once a payment is recorded.
            </p>
          </div>
        ) : (
          <div className="payment-table-wrapper">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <span className="receipt-number">
                        {payment.receiptNumber || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="fee-type-badge">
                        {payment.feeType}
                      </span>
                    </td>

                    <td>
                      <strong className="payment-amount">
                        Rs. {payment.amount}
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        {payment.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span className="payment-date">
                        {new Date(
                          payment.paymentDate
                        ).toLocaleDateString()}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="receipt-download-btn"
                        onClick={() =>
                          handleDownloadReceipt(payment._id)
                        }
                      >
                        ↓ Download
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

export default PaymentHistory;