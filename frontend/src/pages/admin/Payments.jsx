import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Payments.css";

function Payments() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    feeType: "",
    paymentMethod: "",
    remarks: "",
  });

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
const [feeType, setFeeType] = useState("");
const [paymentMethod, setPaymentMethod] = useState("");

const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const limit = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 100,
          },
        });

        setStudents(response.data.students);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load students"
        );
      }
    };

    fetchStudents();
  }, []);

 useEffect(() => {
  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          feeType,
          paymentMethod,
          page,
          limit,
        },
      });

      setPayments(response.data.payments);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load payments"
      );
    } finally {
      setPaymentsLoading(false);
    }
  };

  fetchPayments();
}, [search, feeType, paymentMethod, page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/payments",
        {
          student: selectedStudent,
          amount: Number(formData.amount),
          feeType: formData.feeType,
          paymentMethod: formData.paymentMethod,
          remarks: formData.remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Payment recorded successfully. Receipt: ${response.data.payment.receiptNumber}`
      );

      const paymentsResponse = await api.get("/payments", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  params: {
    limit: 100,
  },
});

setPayments(
  paymentsResponse.data.payments || paymentsResponse.data
);

      setSelectedStudent("");

      setFormData({
        amount: "",
        feeType: "",
        paymentMethod: "",
        remarks: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to record payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="payments-page">
    <div className="page-header">
      <div>
        <h1>Payments</h1>
        <p>Record student fee payments</p>
      </div>
    </div>

    {message && <div className="success-message">{message}</div>}
    {error && <div className="error-message">{error}</div>}

    <div className="payment-form-card">
      <div className="section-title">
        <h2>Record Payment</h2>
        <p>Enter the payment details for a student</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="payment-form-grid">
          <div className="form-group">
            <label>Student</label>

            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.studentId} - {student.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-group">
            <label>Fee Type</label>

            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
              required
            >
              <option value="">Select Fee Type</option>
              <option value="Tuition">Tuition</option>
              <option value="Transport">Transport</option>
              <option value="Exam">Exam</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method</label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Remarks</label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Optional"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </form>
    </div>

    <div className="payment-history-card">
      <div className="section-title">
        <h2>Payment History</h2>
        <p>View and filter recorded payments</p>
      </div>

      <div className="payment-filters">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={feeType}
          onChange={(e) => {
            setFeeType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Fee Types</option>
          <option value="Tuition">Tuition</option>
          <option value="Transport">Transport</option>
          <option value="Exam">Exam</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
          <option value="Cheque">Cheque</option>
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={() => {
            setSearch("");
            setFeeType("");
            setPaymentMethod("");
            setPage(1);
          }}
        >
          Clear Filters
        </button>
      </div>

      {paymentsLoading ? (
        <p className="table-message">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="table-message">No payments found.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Receipt</th>
                  <th>Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="student-name">
                      {payment.student?.studentId} -{" "}
                      {payment.student?.name}
                    </td>

                    <td>
                      <span className="fee-type-badge">
                        {payment.feeType}
                      </span>
                    </td>

                    <td className="amount-cell">
                      Rs. {payment.amount}
                    </td>

                    <td>{payment.paymentMethod}</td>

                    <td>
                      <span className="receipt-badge">
                        {payment.receiptNumber}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>{payment.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              Page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
}

export default Payments;