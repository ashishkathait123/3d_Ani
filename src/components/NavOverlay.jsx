import React, { useState } from "react";
import { X, Menu } from 'lucide-react'; // Using Lucide React for icons

export const NavOverlay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "#" },
    { name: "PRODUCT", href: "#" },
    { name: "GALLERY", href: "#" },
    { name: "DAO", href: "#" },
    { name: "COMMUNITY", href: "#" },
    { name: "COMPANY >", href: "#" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      
      {/* Navbar Container */}
      <nav className="absolute top-3 w-full flex justify-between items-center px-5 text-white text-lg pointer-events-auto">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          {/* Logo SVG (Original) */}
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
          <span className="font-bold tracking-wider text-xl">Dr. Design</span>
        </div>

        {/* Desktop Menu (Visible on sm and up) */}
        <ul className="hidden sm:flex space-x-6 lg:space-x-10 border-2 border-gray-400 p-2 text-sm lg:text-base font-mono uppercase tracking-widest">
          {navLinks.map(link => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-[#cc0033] transition-colors duration-300">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Icon (Visible below sm) */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden p-3 rounded-xl border border-white/50 bg-black/30 backdrop-blur-sm shadow-lg transition-colors hover:border-[#cc0033]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Sidebar Overlay (Outside nav for fixed positioning) */}
      
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-black/90 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-500 ease-in-out border-l-2 border-gray-700
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`
        }
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <span className="text-xl font-bold text-white tracking-wider">Menu</span>
          <button onClick={toggleSidebar} aria-label="Close navigation menu">
            <X className="w-6 h-6 text-white hover:text-[#cc0033]" />
          </button>
        </div>
        
        <ul className="flex flex-col p-5 space-y-4 text-white font-mono uppercase tracking-widest text-sm">
          {navLinks.map(link => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="block py-2 border-b border-gray-800 hover:text-[#cc0033] transition-colors duration-300"
                onClick={toggleSidebar} // Close on click
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
