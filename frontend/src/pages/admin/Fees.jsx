import { useEffect, useState } from "react";
import api from "../../services/api";

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
    <div>
      <h1>Fee Management</h1>
      <p>Manage student fee structures</p>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Student</label>

          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            disabled={editingFee !== null}
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.studentId} - {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tuition Fee</label>
          <input
            type="number"
            name="tuitionFee"
            value={formData.tuitionFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>Transport Fee</label>
          <input
            type="number"
            name="transportFee"
            value={formData.transportFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>Exam Fee</label>
          <input
            type="number"
            name="examFee"
            value={formData.examFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>Other Fee</label>
          <input
            type="number"
            name="otherFee"
            value={formData.otherFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <h3>Total Fee: Rs. {total}</h3>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingFee
              ? "Update Fee Structure"
              : "Save Fee Structure"}
        </button>

        {editingFee && (
          <button
            type="button"
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
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Existing Fee Structures</h2>

      {feesLoading ? (
        <p>Loading fee structures...</p>
      ) : fees.length === 0 ? (
        <p>No fee structures found.</p>
      ) : (
        <table>
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
                <td>
                  {fee.student?.studentId} - {fee.student?.name}
                </td>
                <td>Rs. {fee.tuitionFee}</td>
                <td>Rs. {fee.transportFee}</td>
                <td>Rs. {fee.examFee}</td>
                <td>Rs. {fee.otherFee}</td>
                <td>Rs. {fee.totalFee}</td>
                <td>
                  <button onClick={() => handleEdit(fee)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Fees;
