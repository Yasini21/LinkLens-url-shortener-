import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {FiLink,FiMoon,FiSun,FiMenu,FiX}from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
 const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

  return (
  <nav className="navbar">

    <div className="brand">
      <div className="brand-mark">
        <FiLink />
      </div>

      <div className="brand-copy">
        <span className="brand-name">LinkLens</span>
        <span className="brand-subtitle">
          Shorten. Track. Grow.
        </span>
      </div>
    </div>

    {/* Desktop navigation (visible on larger screens) */}
    <div className="nav-desktop">
      <div className="nav-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Analytics
        </NavLink>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
          <span className="theme-text">
            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>
        </button>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>

    {/* Mobile hamburger + mobile menu (visible on small screens) */}
    <button
      className="hamburger-btn"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-expanded={menuOpen}
      aria-controls="nav-mobile"
    >
      {menuOpen ? <FiX /> : <FiMenu />}
    </button>

    <div id="nav-mobile" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>

      <div className="nav-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={() => setMenuOpen(false)}
        >
          Analytics
        </NavLink>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
          <span className="theme-text">
            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>
        </button>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

    </div>

  </nav>
);
}

export default Navbar;