// src/components/HeaderBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function HeaderBar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // keep track of auth in header
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate("/LoginPage");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // optionally navigate back to login
    navigate("/LoginPage");
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="flex items-center justify-between h-16 px-4">
        {/* left side: logo + mobile hamburger */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="md:hidden mr-4 p-2 text-gray-800 focus:outline-none"
          >
            {/* hamburger icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold italic font-[cursive] truncate">
            Plantique
          </h1>
        </div>

        {/* right side: login status */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* greet on sm+ */}
              <span className="hidden sm:block text-gray-700 text-sm">
                Logged in as
                <strong className="text-gray-900"> {user.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded "
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
