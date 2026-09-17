import { useEffect, useState } from "react";
import api from "../../services/api";

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
    <div>
      <h1>Payments</h1>
      <p>Record student fee payments</p>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Student</label>

          <select
            value={selectedStudent}
            onChange={(e) =>
              setSelectedStudent(e.target.value)
            }
            required
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
              >
                {student.studentId} - {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
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

        <div>
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

        <div>
          <label>Remarks</label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record Payment"}
        </button>
      </form>
      
<div>
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

      <h2>Payment History</h2>

{paymentsLoading ? (
  <p>Loading payments...</p>
) : payments.length === 0 ? (
  <p>No payments found.</p>
) : (
  <table>
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
          <td>
            {payment.student?.studentId} -{" "}
            {payment.student?.name}
          </td>

          <td>{payment.feeType}</td>

          <td>Rs. {payment.amount}</td>

          <td>{payment.paymentMethod}</td>

          <td>{payment.receiptNumber}</td>

          <td>
            {new Date(payment.paymentDate).toLocaleDateString()}
          </td>

          <td>{payment.remarks || "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

<div>
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage(page + 1)}
    disabled={page === totalPages}
  >
    Next
  </button>
</div>
    </div>
  );
}

export default Payments;