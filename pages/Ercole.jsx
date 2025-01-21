import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Link } from "react-router-dom";
import Farnese from "../models/Farnese";
import Giambo from "../models/Giambo";
import Omphales from "../models/Omphales";

const Ercole = () => {
  const [isFirstVisible, setIsFirstVisible] = useState(false);
  const [isSecondVisible, setIsSecondVisible] = useState(false);
  const [isStatueVisible, setIsStatueVisible] = useState(false);
  const [isSecondStatueVisible, setIsSecondStatueVisible] = useState(false);
  const [isThirdStatueVisible, setIsThirdStatueVisible] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);
   const isDragging = useRef(false);
    const previousMousePosition = useRef([0, 0]);


  useEffect(() => {
    const autoRotateInterval = setInterval(() => {
      setRotation((prevRotation) => [
        prevRotation[0],
        prevRotation[1] + 0.005,
        prevRotation[2],
      ]);
    }, 16);

    return () => clearInterval(autoRotateInterval);
  }, []);

  useEffect(() => {
    const sections = [
      { id: "first-section", setState: setIsFirstVisible },
      { id: "second-section", setState: setIsSecondVisible },
       { id: "statue-section", setState: setIsStatueVisible },
       { id: "second-statue-section", setState: setIsSecondStatueVisible },
      { id: "third-statue-section", setState: setIsThirdStatueVisible },
    ];

    const observerOptions = { threshold: 0.5 };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        sections.forEach((section) => {
          if (entry.target.id === section.id) {
            section.setState(entry.isIntersecting);
          }
        });
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(({ id }) => {
      const sectionElement = document.querySelector(`#${id}`);
      if (sectionElement) observer.observe(sectionElement);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseDown = (event) => {
        isDragging.current = true;
        previousMousePosition.current = [event.clientX, event.clientY];
    };

  const handleMouseMove = (event) => {
        if (!isDragging.current) return;

        const deltaX = event.clientX - previousMousePosition.current[0];
        const deltaY = event.clientY - previousMousePosition.current[1];

        setRotation((prevRotation) => [
            prevRotation[0] + deltaY * 0.01,
            prevRotation[1] + deltaX * 0.01,
           0,
        ]);
         previousMousePosition.current = [event.clientX, event.clientY];
    };

  const handleMouseUp = () => {
         isDragging.current = false;
    };

  useEffect(() => {
       window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

      return () => {
            window.removeEventListener("mouseup", handleMouseUp);
           window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);


  return (
    <div className="w-full h-[500vh] relative overflow-hidden">
      <section
        id="first-section"
        className={`absolute top-0 w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out ${
          isFirstVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center p-8">
          <h1 className="text-5xl text-shadow font-bold">Benvenuto al Tour</h1>
          <p className="text-lg mt-4">Esplora le infinite possibilità dell'arte 3D.</p>
        </div>
      </section>

      <section
        id="second-section"
        className={`absolute top-[100vh] w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out ${
          isSecondVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center p-8">
          <h1 className="text-5xl text-shadow font-bold">
            Scopri l'Arte in una Nuova Dimensione
          </h1>
            <p className="text-lg mt-4">Inizia il tuo viaggio qui sotto.</p>
        </div>
      </section>

      <section
        id="statue-section"
        className={`absolute top-[200vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
          isStatueVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} />
          {isStatueVisible && <Farnese scale={[1, 1, 1]} rotation={rotation} />}
        </Canvas>
        <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-bold mb-4">Statua del Farnese</h2>
          <p className="mb-4 line-height">
           L'<span className="font-bold">Ercole Farnese</span>, copia romana di un originale greco, ritrae l'eroe a riposo dopo le sue fatiche, mettendo in mostra la sua potente muscolatura e la sua posa contemplativa.
            </p>
          <p className="mb-4 line-height">
             Questa statua è rinomata per le sue dimensioni e la resa dettagliata della forma dell'eroe, ed è una delle più famose rappresentazioni della forza nella scultura classica.
           </p>
          <Link to="/projects" className="btn-style mt-8">
             Visualizza Statua
          </Link>
        </div>
      </section>

      <section
        id="second-statue-section"
        className={`absolute top-[300vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
          isSecondStatueVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
           <h2 className="text-3xl font-bold mb-4">Statua di Giambologna</h2>
           <p className="mb-4 line-height">
          L'<span className="font-bold">Ercole di Giambologna</span> cattura l'eroe in una posa dinamica e tortuosa, enfatizzando la sua forza e l'intensità della sua lotta.
            </p>
          <p className="mb-4 line-height">
                Questa statua è uno studio sul movimento e la potenza, che mostra la capacità dell'artista di trasmettere movimento ed emozione nel bronzo.
            </p>
          <Link to="/giambologna" className="btn-style mt-8">
            Visualizza Statua
          </Link>
        </div>
        <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} />
          {isSecondStatueVisible && <Giambo scale={[1, 1, 1]} rotation={rotation} />}
        </Canvas>
      </section>
      <section
        id="third-statue-section"
        className={`absolute top-[400vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
          isThirdStatueVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} />
           {isThirdStatueVisible && <Omphales scale={[1, 1, 1]} rotation={rotation} />}
        </Canvas>
        <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-bold mb-4">Statua di Onfale</h2>
          <p className="mb-4 line-height">
           Questa scultura unica mostra <span className="font-bold">Ercole</span> in una rara scena di servitù verso la regina Onfale, vestito con abiti femminili e in possesso dei suoi attributi, evidenziando la sua temporanea umiliazione.
            </p>
          <p className="mb-4 line-height">
           La statua funge da allegoria del potere dell'amore e della temporanea sottomissione della forza a un'autorità superiore.
            </p>
          <Link to="/omph" className="btn-style mt-8">
           Visualizza Statua
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ercole;