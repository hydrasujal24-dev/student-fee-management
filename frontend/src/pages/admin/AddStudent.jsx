import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    className: "",
    section: "",
    parentName: "",
    parentPhone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await api.post("/students", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Student added successfully.");

      setTimeout(() => {
        navigate("/admin/students");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Student</h1>
      <p>Create a new student record</p>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Class</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            placeholder="e.g. BIT"
            required
          />
        </div>

        <div>
          <label>Section</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div>
          <label>Parent Name</label>
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Parent Phone</label>
          <input
            type="text"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/students")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddStudent;