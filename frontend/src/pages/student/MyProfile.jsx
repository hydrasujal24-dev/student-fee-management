import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyProfile.css";

function MyProfile() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudent(response.data.student);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile"
        );
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="my-profile">
        <div className="profile-error">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="my-profile">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  const firstLetter = student.name?.charAt(0).toUpperCase();

  return (
    <div className="my-profile">
      <div className="profile-page-header">
        <div>
          <p className="profile-label">Student Portal</p>
          <h1>My Profile</h1>
          <p>
            View your personal and academic information.
          </p>
        </div>
      </div>

      <div className="profile-hero-card">
        <div className="profile-avatar">
          {firstLetter}
        </div>

        <div className="profile-hero-info">
          <h2>{student.name}</h2>

          <p className="profile-student-id">
            Student ID: <strong>{student.studentId}</strong>
          </p>

          <span className="profile-status">
            ● Active Student
          </span>
        </div>
      </div>

      <div className="profile-section-grid">
        <div className="profile-info-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">👤</div>

            <div>
              <h2>Personal Information</h2>
              <p>Your basic account information</p>
            </div>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span>Full Name</span>
              <strong>{student.name}</strong>
            </div>

            <div className="profile-info-row">
              <span>Email Address</span>
              <strong>{student.email}</strong>
            </div>

            <div className="profile-info-row">
              <span>Student ID</span>
              <strong>{student.studentId}</strong>
            </div>
          </div>
        </div>

        <div className="profile-info-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">🎓</div>

            <div>
              <h2>Academic Information</h2>
              <p>Your current academic details</p>
            </div>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span>Program / Class</span>
              <strong>{student.className}</strong>
            </div>

            <div className="profile-info-row">
              <span>Section</span>
              <strong>{student.section}</strong>
            </div>

            <div className="profile-info-row">
              <span>Student Status</span>
              <strong className="active-text">
                Active
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-security-card">
        <div>
          <h2>Account Security</h2>
          <p>
            Keep your account secure by regularly updating
            your password.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/student/settings";
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default MyProfile;