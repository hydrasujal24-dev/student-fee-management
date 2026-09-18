import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Branding Section */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-logo">FM</div>

            <p className="brand-label">STUDENT MANAGEMENT</p>

            <h1>
              Fee Management
              <span>System</span>
            </h1>

            <p className="brand-description">
              A simple and secure platform to manage student fees,
              payments, records and digital receipts.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Student Management</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Fee & Payment Tracking</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Digital Payment Receipts</span>
              </div>
            </div>
          </div>

          <p className="brand-footer">
            Secure • Simple • Organized
          </p>
        </div>

        {/* Login Section */}
        <div className="login-section">
          <div className="login-card">

            <div className="login-heading">
              <p className="login-welcome">WELCOME BACK</p>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to access the system.
              </p>
            </div>

            {error && (
              <div className="login-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="login-field">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="login-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <p className="login-security">
              Your account information is securely protected.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;