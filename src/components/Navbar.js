import React from "react";
import { Link } from "react-router-dom";
import { auth, signOut } from "../firebase";

function Navbar({ user, ADMIN_EMAIL }) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
      <Link to="/" className="text-xl font-semibold">MyApp</Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/products" className="hover:text-yellow-300 transition-colors duration-200">
              Products
            </Link>
            <Link to="/dashboard" className="hover:text-yellow-300 transition-colors duration-200">Dashboard</Link>

            {/* ---------- Admin Link (visible only for admin) ---------- */}
            {user.email === ADMIN_EMAIL && (
              <Link to="/admin" className="hover:text-yellow-300 transition-colors duration-200">
                Admin
              </Link>
            )}

            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.displayName?.split(" ")[0]}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
