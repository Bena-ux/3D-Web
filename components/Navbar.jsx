import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isDayMode, setIsDayMode] = useState(true);

  // Initialize theme based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours();
    const initialMode = currentHour >= 7 && currentHour < 19;
    setIsDayMode(initialMode);

    document.body.classList.toggle('day-mode', initialMode);
    document.body.classList.toggle('night-mode', !initialMode);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDayMode((prev) => !prev);
    document.body.classList.toggle('day-mode');
    document.body.classList.toggle('night-mode');
  };

  // Open/close dropdowns
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
    setIsSubmenuOpen(false);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border border-white/20 p-4 relative z-50">
      <div className="flex justify-between items-center w-full">
        {/* Left Side: Digital Museum */}
        <Link
          to="/"
          className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
        >
          Digital Museum
        </Link>

        {/* Centered Navigation Links */}
        <div className="flex items-center space-x-6 mx-auto">
          {/* Discover with Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/discover"
              className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
            >
              Discover
            </Link>
            <div
              className={`absolute mt-1 w-48 border-gray-500 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform backdrop-blur-lg bg-white/20 border border-white/30 ${
                isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'
              }`}
            >
              <div
                className="relative"
                onMouseEnter={() => setIsSubmenuOpen(true)}
                onMouseLeave={() => setIsSubmenuOpen(false)}
              >
                <Link
                  to="/ercole"
                  className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                >
                  Ercole
                </Link>

                {/* Submenu for Ercole */}
                <div
                  className={`absolute left-full top-0 mt-1 w-48 border-gray-500 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform backdrop-blur-lg bg-white/20 border border-white/30 ${
                    isSubmenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'
                  }`}
                >
                  <Link
                    to="/projects"
                    className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                  >
                    Farnese
                  </Link>
                  <Link
                    to="/giambologna"
                    className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                  >
                    Giambologna
                  </Link>
                  <Link
                    to="/omph"
                    className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                  >
                    Omphales
                  </Link>
                </div>
              </div>
              <Link
                to="/option2"
                className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
              >
                Option 2
              </Link>
              <Link
                to="/option3"
                className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
              >
                Option 3
              </Link>
            </div>
          </div>

          {/* Other Links */}
          <Link
            to="/about"
            className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
          >
            Contact
          </Link>
          <Link
            to="/gift"
            className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'} whitespace-nowrap`}
          >
            Get a Gift
          </Link>
        </div>

        {/* Theme Toggle Button with Stylized Sun and Moon Silhouettes */}
        <div className="flex items-center space-x-2 ml-auto mr-4">
          {/* Sun and Moon Icons */}
          <span className="text-xl">
            {isDayMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 day-text"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7m-12.02 12.02l-.7.7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 night-text"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </span>

          {/* Toggle Switch */}
          <div
            className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center px-1 cursor-pointer"
            onClick={toggleTheme}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center bg-white shadow-md transition-transform duration-300 ${
                isDayMode ? 'translate-x-0' : 'translate-x-6'
              }`}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
