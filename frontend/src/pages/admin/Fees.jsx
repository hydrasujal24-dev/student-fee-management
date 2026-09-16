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

      await api.post(
        "/fees",
        {
          student: selectedStudent,
          tuitionFee: Number(formData.tuitionFee) || 0,
          transportFee: Number(formData.transportFee) || 0,
          examFee: Number(formData.examFee) || 0,
          otherFee: Number(formData.otherFee) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Fee structure saved successfully.");

      setFormData({
        tuitionFee: "",
        transportFee: "",
        examFee: "",
        otherFee: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save fee structure"
      );
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
          {loading ? "Saving..." : "Save Fee Structure"}
        </button>
      </form>
    </div>
  );
}

export default Fees;