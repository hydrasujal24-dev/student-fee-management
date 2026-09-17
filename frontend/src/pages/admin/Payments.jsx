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
          limit: 100,
        },
      });

      setPayments(response.data.payments || response.data);
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
}, []);

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
    </div>
  );
}

export default Payments;