import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isFirstVisible, setIsFirstVisible] = useState(true);
    const [isSecondVisible, setIsSecondVisible] = useState(false);
    const [isThirdVisible, setIsThirdVisible] = useState(false);

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

        // Show the third rectangle after the second
        if (scrollY >= window.innerHeight) {
            setIsThirdVisible(true);
        } else {
            setIsThirdVisible(false);
        }
    }, [scrollY]);

    // Fade in the first rectangle on component mount
    useEffect(() => {
        setIsFirstVisible(true); // Ensure the first rectangle is visible
    }, []);

    return (
        <div className="w-full h-[225vh] relative">
            {/* First rectangle */}
            <section
                className={`absolute top-0 w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
                    ${isFirstVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="text-center">
                    <h1 className="text-5xl text-shadow font-bold">Scatena la tua Immaginazione!</h1>
                    <p className="text-lg mt-4">Esplora le infinite possibilità dell'arte 3D.</p>
                </div>
            </section>

            {/* Second rectangle */}
            <section
                className={`absolute top-[100vh] w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
                    ${isSecondVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="text-center">
                    <h1 className="text-5xl text-shadow font-bold">Scopri l'Arte in una Nuova Dimensione</h1>
                    <p className="text-lg mt-4">Inizia il tuo viaggio qui sotto.</p>
                    <p className="text-lg mt-2">Acquista un modello 3D stampato per supportare l'iniziativa.</p>
                </div>
            </section>

            {/* Buttons */}
            <div
                className={`absolute top-[200vh] w-full flex justify-center items-center space-x-8 transition-opacity duration-700 ease-in-out mt-4
                    ${isThirdVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <Link to="/discover">
                    <button className="btn-style">Inizia il Tour</button>
                </Link>
                <Link to="/gift">
                    <button className="btn-style">Ricevi un Regalo</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;