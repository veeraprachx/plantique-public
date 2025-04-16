import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed md:static top-0 left-0 h-screen w-48 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <nav className="space-y-1">
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-300 font-bold" : ""
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/Monitor-Control"
          onClick={onClose}
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-300 font-bold" : ""
            }`
          }
        >
          Monitor & Control
        </NavLink>
        <NavLink
          to="/Command-Log"
          onClick={onClose}
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-300 font-bold" : ""
            }`
          }
        >
          Command Log
        </NavLink>
        <NavLink
          to="/Environment-Info"
          onClick={onClose}
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-300 font-bold" : ""
            }`
          }
        >
          Environment Log
        </NavLink>
        <NavLink
          to="/Images"
          onClick={onClose}
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-300 font-bold" : ""
            }`
          }
        >
          Images
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
