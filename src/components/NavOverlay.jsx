// src/components/NavOverlay.jsx
import React from "react";

export const NavOverlay = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {/* Navbar */}
      <nav className="absolute top-3 w-full flex justify-between items-center px-5 text-white text-lg pointer-events-auto">
        <div className="flex items-center space-x-2">
          {/* Logo - replace with your actual logo */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-bold tracking-wider">Dr. Design</span>
        </div>

        <ul className="flex space-x-10 border-2 border-gray-400 p-2">
          <li>
            <a href="#" className="hover:text-gray-400">
              HOME
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              PRODUCT
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              GALLERY
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              DAO
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              COMMUNITY
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              COMPANY &gt;
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Title Section */}
      <div className="text-content-wrapper pointer-events-auto">
        {/* <h1 className="title-text text-white">Turn Ideas Into Multi-Format Universes</h1>
        <a href="#" className="button-style">
          KEEP EXPLORING &gt;
        </a> */}
      </div>
    </div>
  );
};
