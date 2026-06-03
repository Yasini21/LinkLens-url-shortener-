import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        password,
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
    <form onSubmit={handleSubmit}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />
      {
  error && (
    <p>{error}</p>
  )
}

     <button
  type="submit"
>
  {
    loading
      ? "Logging In..."
      : "Login"
  }
</button>

    </form>
  );
}

export default Login;