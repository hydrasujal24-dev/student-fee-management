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
      setTotalPages(response.data.totalPages || 1);
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

  if (error) {
    return <p>{error}</p>;
  }

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

    {error && <div className="error-message">{error}</div>}

    <div className="student-filters">
      <input
        type="text"
        placeholder="Search by name, email or student ID..."
        value={search}
        onChange={handleSearchChange}
      />

      <select value={className} onChange={handleClassChange}>
        <option value="">All Classes</option>
        <option value="BIT">BIT</option>
        <option value="BCA">BCA</option>
        <option value="BBA">BBA</option>
      </select>

      <select value={section} onChange={handleSectionChange}>
        <option value="">All Sections</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </div>

    <div className="students-card">
      {loading ? (
        <p className="table-message">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="table-message">No students found.</p>
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