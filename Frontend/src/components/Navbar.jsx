import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (
    <nav className="navbar">

      <h2>URL Analytics Platform</h2>

      <button
        onClick={handleLogout}
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;