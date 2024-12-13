import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Discover = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isFirstVisible, setIsFirstVisible] = useState(true);
  const [isSecondVisible, setIsSecondVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  // Handle scroll event
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update visibility based on scroll position
  useEffect(() => {
    if (scrollY > window.innerHeight * 0.5) {
      setIsFirstVisible(false);
      setIsSecondVisible(true);
    } else {
      setIsFirstVisible(true);
      setIsSecondVisible(false);
    }

    // Show the button after the second rectangle
    if (scrollY >= window.innerHeight) {
      setIsButtonVisible(true);
    } else {
      setIsButtonVisible(false);
    }
  }, [scrollY]);

  // Fade in the first rectangle on component mount
  useEffect(() => {
    setIsFirstVisible(true);
  }, []);

  return (
    <div className="w-full h-[300vh] relative">
      {/* First rectangle */}
      <section
        className={`absolute top-0 w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
        ${isFirstVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center">
          <h1 className="text-5xl text-shadow font-bold">Discover the Digital Museum</h1>
          <p className="text-lg mt-4">
            Immerse yourself in a world where history and technology unite.
          </p>
        </div>
      </section>

      {/* Second rectangle */}
      <section
        className={`absolute top-[100vh] w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
        ${isSecondVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center">
          <h1 className="text-5xl text-shadow font-bold">Explore Iconic Statues</h1>
          <p className="text-lg mt-4">
            Learn about the stories and significance behind each masterpiece.
          </p>
        </div>
      </section>

      {/* Button */}
      <div
        className={`absolute top-[210vh] w-full flex justify-center items-center transition-opacity duration-700 ease-in-out
        ${isButtonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Link to="/ercole">
          <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-lg shadow-md transition duration-300">
            Explore Ercole
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Discover;
