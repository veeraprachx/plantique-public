// src/components/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // track auth state, but no navigation
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      setMessage("You are now logged in!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMessage("Logged out successfully.");
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-b p-4 pt-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            {user ? "Welcome Back" : "Welcome to Plantique"}
          </h1>

          {user ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                Already logged in as{" "}
                <strong className="text-gray-800">{user.email}</strong>
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 
                           focus:ring-red-300 focus:ring-2 text-white 
                           font-medium rounded-lg transition"
              >
                Log Out
              </button>
              {message && <p className="text-sm text-blue-600">{message}</p>}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              {message && (
                <p className="text-sm text-blue-600 text-center">{message}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                           focus:ring-blue-500 focus:ring-2 text-white 
                           font-medium rounded-lg transition"
              >
                Log In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
