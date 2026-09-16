import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
  <div>
    <div>
      <h1>Students</h1>
      <p>Manage student records</p>

      <button onClick={() => navigate("/admin/students/add")}>
        Add Student
      </button>
    </div>

      <div>
        <input
          type="text"
          placeholder="Search by name, email or student ID"
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

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          <table>
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
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.className}</td>
                  <td>{student.section}</td>
                  <td>{student.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
}

export default Students;