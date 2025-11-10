import React, { useEffect, useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="navbar shadow bg-base-100">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          AI Resume Maker
        </Link>
      </div>

      <div className="navbar-end">
        {!isLoggedIn ? (
          <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium hidden md:block">
              Hi, {user?.name || "User"}
            </span>
            <button onClick={handleLogout} className="btn btn-sm btn-error">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
