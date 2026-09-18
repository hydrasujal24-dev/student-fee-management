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
            <div className="brand-icon">₹</div>

            <h1>Fee Management<br />System</h1>

            <p>
              A simple and secure platform for managing
              student fees, payments and records.
            </p>

            <div className="brand-features">
              <div>✓ Student Management</div>
              <div>✓ Fee Tracking</div>
              <div>✓ Payment Records</div>
              <div>✓ Digital Receipts</div>
            </div>
          </div>

          <p className="brand-footer">
            Student Fee Management System
          </p>
        </div>

        {/* Login Section */}
        <div className="login-section">
          <div className="login-card">

            <div className="login-heading">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="login-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="login-field">
                <label>Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
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
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <p className="login-footer">
              Secure access to your fee management account
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;