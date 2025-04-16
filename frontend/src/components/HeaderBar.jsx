import React from "react";

export default function HeaderBar({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="w-full flex items-center h-16 px-4 justify-between">
        <h1 className="text-2xl md:text-3xl font-bold italic font-[cursive] truncate">
          Plantique
        </h1>
        {/* Hamburger button visible only on mobile */}
        <button
          className="md:hidden block focus:outline-none text-gray-800"
          onClick={onToggleSidebar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
