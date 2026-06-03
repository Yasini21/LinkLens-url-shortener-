import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.msg ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <span className="eyebrow">SaaS-ready link intelligence</span>

        <h1>
          Link<span>Lens</span>
        </h1>

        <h2>
          Shorten links with confidence.
        </h2>

        <p>
          Track every click, generate instant QR codes,
          and analyze audience behavior with clean dashboards.
        </p>

        <div className="feature-grid">
          <div className="feature-item">
            <FiCheckCircle />
            <span>Fast setup in minutes</span>
          </div>

          <div className="feature-item">
            <FiShield />
            <span>Reliable link security</span>
          </div>

          <div className="feature-item">
            <FiTrendingUp />
            <span>Growth-ready insights</span>
          </div>
        </div>

        <div className="trust-row">
          <span>Trusted by modern teams and marketing leaders.</span>
        </div>

      </div>

      <div className="auth-card">

        <h2>
          Welcome Back 👋
        </h2>

        <p>
          Login to continue
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <div className="password-wrapper">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {
                showPassword
                  ? <FiEyeOff />
                  : <FiEye />
              }
            </button>

          </div>

          {
            error &&
            <p className="error-text">
              {error}
            </p>
          }

          <button
            className="auth-btn"
            type="submit"
          >
            {
              loading
                ? "Signing In..."
                : "Login"
            }
          </button>

        </form>

        <p className="bottom-text">

          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
