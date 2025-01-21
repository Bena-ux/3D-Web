import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null); // 'ercole', 'michelangelo', or null
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
     const handleMouseEnter = () => {
        setIsDropdownOpen(true);
      };
    const handleMouseLeave = () => {
           setIsDropdownOpen(false);
          setActiveSubmenu(null);

    };

    const handleSubmenuEnter = (submenu) => {
        setActiveSubmenu(submenu);
    };

    const handleSubmenuLeave = () => {
        setActiveSubmenu(null);
    };

    return (
        <nav className="bg-white/10 backdrop-blur-md border border-white/20 p-4 relative z-50">
            <div className="flex justify-between items-center w-full">
                {/* Left Side: Digital Museum */}
                <Link
                    to="/"
                    className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
                >
                    Museo Digitale
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
                            Percorsi
                        </Link>
                        <div
                            className={`absolute mt-1 w-48 border-gray-500 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform backdrop-blur-lg bg-white/20 border border-white/30 ${
                                isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'
                            }`}
                        >
                            <div
                                className="relative"
                                onMouseEnter={() => handleSubmenuEnter('ercole')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                <Link
                                    to="/ercole"
                                    className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                                >
                                    Ercole
                                </Link>

                                {/* Submenu for Ercole */}
                                {activeSubmenu === 'ercole' && (
                                    <div
                                        className={`absolute left-full top-0 mt-1 w-48 border-gray-500 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform backdrop-blur-lg bg-white/20 border border-white/30`}
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
                                )}
                            </div>
                            <div
                                className="relative"
                                onMouseEnter={() => handleSubmenuEnter('michelangelo')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                <Link
                                    to="/michelangelo"
                                    className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                                >
                                    Michelangelo
                                </Link>
                                {/* Submenu for Michelangelo */}
                                {activeSubmenu === 'michelangelo' && (
                                    <div
                                        className={`absolute left-full top-0 mt-1 w-48 border-gray-500 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform backdrop-blur-lg bg-white/20 border border-white/30`}
                                    >
                                        <Link
                                            to="/pietas"
                                            className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                                        >
                                            Pietà
                                        </Link>
                                        <Link
                                            to="/davide"
                                            className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                                        >
                                            Davide
                                        </Link>
                                         <Link
                                            to="/moses"
                                            className={`block px-4 py-2 text-lg font-semibold ${isDayMode ? 'text-black' : 'text-white'} transition duration-300 ease-in-out hover:bg-[#ffa500] hover:text-white hover:shadow-[0px_0px_15px_5px_rgba(255,165,0,0.8)]`}
                                        >
                                            Mosè
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Other Links */}
                    <Link
                        to="/about"
                        className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
                    >
                        Informazioni
                    </Link>
                    <Link
                        to="/contact"
                        className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'}`}
                    >
                        Contatti
                    </Link>
                    <Link
                        to="/gift"
                        className={`text-lg font-bold ${isDayMode ? 'text-black' : 'text-white'} whitespace-nowrap`}
                    >
                        Ricevi un Regalo
                    </Link>
                </div>
                {/* Theme Toggle Button with Slider and Circle */}
                <div className="flex items-center mr-4">
                    <div
                        className={`relative w-14 h-7 bg-gray-300 rounded-full transition-colors duration-300 ${
                            isDayMode ? 'bg-gray-300' : 'bg-gray-700'
                        }`}
                        onClick={toggleTheme}
                        style={{ cursor: 'pointer' }}
                    >
                        <span
                            className={`absolute left-1 top-1 w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${
                                isDayMode ? 'bg-black translate-x-0' : 'bg-[#ffa500] translate-x-7'
                            }`}
                            style={{boxShadow: isDayMode ? 'none' : '0px 0px 15px 5px rgba(255,165,0,0.8)'}}
                        >
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;