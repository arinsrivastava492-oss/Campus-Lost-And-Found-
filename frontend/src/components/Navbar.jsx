// components/Navbar.jsx
// -----------------------------------------------------------------------
// The top navigation bar shown on every page. What's shown changes
// depending on whether someone is logged in or not.
// -----------------------------------------------------------------------

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🧷 Campus Lost &amp; Found
        </Link>

        <nav className="navbar-links">
          <Link to="/">Browse</Link>

          {user ? (
            <>
              <Link to="/report">Report an item</Link>
              <Link to="/my-items">My posts</Link>
              <span className="helper-text" style={{ margin: 0 }}>
                Hi, {user.name.split(" ")[0]}
              </span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
