import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, onAuthStateChanged } from "./firebase";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Products from "./components/Products";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

const ADMIN_EMAIL = "admin@gmail.com"; // Define admin email here

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={user} ADMIN_EMAIL={ADMIN_EMAIL} />

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <h2 className="p-6 text-red-600">Please log in to access dashboard</h2>
            )
          }
        />
        <Route
          path="/admin"
          element={
            user?.email === ADMIN_EMAIL ? (
              <AdminDashboard />
            ) : (
              <h2 className="p-6 text-red-600">Access denied. You are not admin.</h2>
            )
          }
        />
      <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;


