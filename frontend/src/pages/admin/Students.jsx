import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Students.css";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const limit = 10;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          className,
          section,
          page,
          limit,
        },
      });

      setStudents(response.data.students);
      setTotalPages(
        response.data.pagination?.totalPages ||
          response.data.totalPages ||
          1
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, className, section, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClassChange = (e) => {
    setClassName(e.target.value);
    setPage(1);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
    setPage(1);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);

    setEditForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
    });

    setError("");
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/students/${editingStudent._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingStudent(null);
      setEditForm({});

      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      await api.delete(`/students/${student._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete student"
      );
    }
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage student records</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/admin/students/add")}
        >
          + Add Student
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {editingStudent && (
        <div className="edit-student-card">
          <div className="edit-header">
            <div>
              <h2>Edit Student</h2>
              <p>Update student information</p>
            </div>

            <button
              className="close-edit-btn"
              onClick={() => {
                setEditingStudent(null);
                setEditForm({});
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="edit-form-grid">
              <div className="form-group">
                <label>Student ID</label>
                <input
                  name="studentId"
                  value={editForm.studentId || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={editForm.phone || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Class</label>
                <select
                  name="className"
                  value={editForm.className || ""}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="BIT">BIT</option>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                </select>
              </div>

              <div className="form-group">
                <label>Section</label>
                <select
                  name="section"
                  value={editForm.section || ""}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div className="form-group">
                <label>Parent Name</label>
                <input
                  name="parentName"
                  value={editForm.parentName || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Phone</label>
                <input
                  name="parentPhone"
                  value={editForm.parentPhone || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  name="address"
                  value={editForm.address || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="edit-actions">
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => {
                  setEditingStudent(null);
                  setEditForm({});
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-edit-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="student-filters">
        <input
          type="text"
          placeholder="Search by name, email or student ID..."
          value={search}
          onChange={handleSearchChange}
        />

        <select
          value={className}
          onChange={handleClassChange}
        >
          <option value="">All Classes</option>
          <option value="BIT">BIT</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
        </select>

        <select
          value={section}
          onChange={handleSectionChange}
        >
          <option value="">All Sections</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div className="students-card">
        {loading ? (
          <p className="table-message">
            Loading students...
          </p>
        ) : students.length === 0 ? (
          <p className="table-message">
            No students found.
          </p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <span className="student-id">
                          {student.studentId}
                        </span>
                      </td>

                      <td className="student-name">
                        {student.name}
                      </td>

                      <td>{student.email}</td>

                      <td>
                        <span className="class-badge">
                          {student.className}
                        </span>
                      </td>

                      <td>{student.section}</td>

                      <td>{student.phone}</td>

                      <td>
                        <div className="student-actions">
                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(student)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(student)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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

export default Students;