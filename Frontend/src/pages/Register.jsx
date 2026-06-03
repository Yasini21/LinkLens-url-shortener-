import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      await API.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );

      navigate("/login");

    } catch (error) {

      setError(
        error.response?.data?.msg ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-left">

        <h1>
          Link<span>Lens</span>
        </h1>

        <h2>
          Create your account 🚀
        </h2>

        <p>
          Start shortening URLs,
          generating QR codes and
          tracking clicks instantly.
        </p>

      </div>

      <div className="auth-card">

        <h2>
          Create Account
        </h2>

        <p>
          Join LinkLens today
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
                setPassword(
                  e.target.value
                )
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
                ? "Creating Account..."
                : "Register"
            }
          </button>

        </form>

        <p className="bottom-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Register;