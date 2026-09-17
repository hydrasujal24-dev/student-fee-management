import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Fees.css";

function Fees() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [formData, setFormData] = useState({
    tuitionFee: "",
    transportFee: "",
    examFee: "",
    otherFee: "",
  });

  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const [editingFee, setEditingFee] = useState(null);

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
        setError(err.response?.data?.message || "Failed to load students");
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setFeesLoading(true);

        const token = localStorage.getItem("token");

        const response = await api.get("/fees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFees(response.data.fees || response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load fee structures",
        );
      } finally {
        setFeesLoading(false);
      }
    };

    fetchFees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);

    setSelectedStudent(fee.student._id);

    setFormData({
      tuitionFee: fee.tuitionFee,
      transportFee: fee.transportFee,
      examFee: fee.examFee,
      otherFee: fee.otherFee,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const feeData = {
        tuitionFee: Number(formData.tuitionFee) || 0,
        transportFee: Number(formData.transportFee) || 0,
        examFee: Number(formData.examFee) || 0,
        otherFee: Number(formData.otherFee) || 0,
      };

      if (editingFee) {
        await api.put(`/fees/student/${editingFee.student._id}`, feeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Fee structure updated successfully.");
      } else {
        await api.post(
          "/fees",
          {
            student: selectedStudent,
            ...feeData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessage("Fee structure saved successfully.");
      }

      const response = await api.get("/fees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFees(response.data.fees || response.data);

      setFormData({
        tuitionFee: "",
        transportFee: "",
        examFee: "",
        otherFee: "",
      });

      setSelectedStudent("");
      setEditingFee(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save fee structure");
    } finally {
      setLoading(false);
    }
  };

  const total =
    (Number(formData.tuitionFee) || 0) +
    (Number(formData.transportFee) || 0) +
    (Number(formData.examFee) || 0) +
    (Number(formData.otherFee) || 0);

  return (
    <div className="fees-page">
      <div className="page-header">
        <div>
          <h1>Fee Management</h1>
          <p>Manage student fee structures</p>
        </div>
      </div>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="fee-form-card">
        <div className="section-title">
          <h2>{editingFee ? "Edit Fee Structure" : "Add Fee Structure"}</h2>

          <p>
            {editingFee
              ? "Update the fee structure for this student"
              : "Set the fee structure for a student"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fee-form-grid">
            <div className="form-group full-width">
              <label>Student</label>

              <select
                value={selectedStudent}
                disabled={!!editingFee}
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
              <label>Tuition Fee</label>
              <input
                type="number"
                name="tuitionFee"
                value={formData.tuitionFee}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Transport Fee</label>
              <input
                type="number"
                name="transportFee"
                value={formData.transportFee}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Exam Fee</label>
              <input
                type="number"
                name="examFee"
                value={formData.examFee}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Other Fee</label>
              <input
                type="number"
                name="otherFee"
                value={formData.otherFee}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="fee-total">
            <span>Total Fee</span>
            <strong>Rs. {total}</strong>
          </div>

        <div className="form-actions">
  {editingFee && (
    <button
      type="button"
      className="cancel-btn"
      onClick={() => {
        setEditingFee(null);
        setSelectedStudent("");

        setFormData({
          tuitionFee: "",
          transportFee: "",
          examFee: "",
          otherFee: "",
        });

        setMessage("");
        setError("");
      }}
    >
      Cancel
    </button>
  )}

  <button
    type="submit"
    className="primary-btn"
    disabled={loading}
  >
    {loading
      ? "Saving..."
      : editingFee
      ? "Update Fee Structure"
      : "Save Fee Structure"}
  </button>
</div>
        </form>
      </div>

      <div className="fee-list-card">
        <div className="section-title">
          <h2>Existing Fee Structures</h2>
          <p>View currently assigned student fees</p>
        </div>

        {feesLoading ? (
          <p className="table-message">Loading fee structures...</p>
        ) : fees.length === 0 ? (
          <p className="table-message">No fee structures found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="fees-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Tuition</th>
                  <th>Transport</th>
                  <th>Exam</th>
                  <th>Other</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id}>
                    <td className="student-name">
                      {fee.student?.studentId} - {fee.student?.name}
                    </td>

                    <td>Rs. {fee.tuitionFee}</td>
                    <td>Rs. {fee.transportFee}</td>
                    <td>Rs. {fee.examFee}</td>
                    <td>Rs. {fee.otherFee}</td>

                    <td className="total-cell">Rs. {fee.totalFee}</td>

                    <td>
                     <button
  type="button"
  className="edit-btn"
  onClick={() => handleEdit(fee)}
>
  Edit
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

export default Fees;
