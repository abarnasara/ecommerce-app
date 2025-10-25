/*import React from "react";
import { auth, provider, signInWithPopup } from "../firebase";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      // You can redirect to dashboard here
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl mb-4">Login</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const ADMIN_EMAIL = "admin@gmail.com"; // Admin email

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin email/password login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Invalid email or password");
    }
  };*/

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      // Redirect based on email
      if (userEmail === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Email/Password login (for admin)
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      // Redirect based on email
      if (userEmail === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Invalid email or password");
    }
  };


  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>

      {/* OR divider */}
      <div className="text-center text-gray-500 my-2">— or —</div>

      {/* Email/Password login */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleEmailLogin}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login with Email
      </button>
    </div>
  );
}
