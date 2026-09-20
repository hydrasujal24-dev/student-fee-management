import { useState } from "react";
import api from "../../services/api";
import "./Settings.css";

function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Password changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-settings">
      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h1>Settings</h1>

          <p>
            Manage your account security and password.
          </p>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <div className="settings-card-top">
            <div className="security-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            <div>
              <h2>Change Password</h2>

              <p>
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          {message && (
            <div className="settings-alert settings-success">
              <span className="alert-icon">✓</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="settings-alert settings-error">
              <span className="alert-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form
            className="settings-form"
            onSubmit={handleSubmit}
          >
            <div className="settings-field">
              <label htmlFor="currentPassword">
                Current password
              </label>

              <div className="password-wrapper">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={
                    showPasswords.current
                      ? "text"
                      : "password"
                  }
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword("current")}
                >
                  {showPasswords.current ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="newPassword">
                New password
              </label>

              <div className="password-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={
                    showPasswords.new
                      ? "text"
                      : "password"
                  }
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword("new")}
                >
                  {showPasswords.new ? "Hide" : "Show"}
                </button>
              </div>

              <span className="field-hint">
                Use at least 6 characters.
              </span>
            </div>

            <div className="settings-field">
              <label htmlFor="confirmPassword">
                Confirm new password
              </label>

              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword("confirm")}
                >
                  {showPasswords.confirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="settings-footer">
              <p>
                Your password is securely encrypted before being
                stored.
              </p>

              <button
                type="submit"
                className="change-password-btn"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="security-note">
          <div className="security-note-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 10v6" />
              <path d="M12 7h.01" />
            </svg>
          </div>

          <div>
            <h3>Account security</h3>
            <p>
              Never share your password with anyone. Use a
              password that is difficult for others to guess.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;