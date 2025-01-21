import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Link } from "react-router-dom";
import Pietà from "../models/Pietà";
import David from "../models/David";
import Mosè from "../models/Mosè";

const Michelangelo = () => {
    const [isFirstVisible, setIsFirstVisible] = useState(false);
    const [isSecondVisible, setIsSecondVisible] = useState(false);
    const [isMichelangeloFirstStatueVisible, setIsMichelangeloFirstStatueVisible] = useState(false);
    const [isMichelangeloSecondStatueVisible, setIsMichelangeloSecondStatueVisible] = useState(false);
    const [isMichelangeloThirdStatueVisible, setIsMichelangeloThirdStatueVisible] = useState(false);
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
           { id: "michelangelo-first-statue-section", setState: setIsMichelangeloFirstStatueVisible },
           { id: "michelangelo-second-statue-section", setState: setIsMichelangeloSecondStatueVisible },
           { id: "michelangelo-third-statue-section", setState: setIsMichelangeloThirdStatueVisible },
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
                id="michelangelo-first-statue-section"
                className={`absolute top-[200vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
                  isMichelangeloFirstStatueVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <OrbitControls enableZoom={false} />
                    {isMichelangeloFirstStatueVisible && <Pietà scale={[1, 1, 1]} rotation={rotation} />}
                </Canvas>
                <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
                    <h2 className="text-3xl font-bold mb-4">Statua della Pietà</h2>
                    <p className="mb-4 line-height">
                   La <span className="font-bold">Pietà</span> di Michelangelo, completata nel 1499, è una toccante raffigurazione della <span className="font-bold">Vergine Maria</span> che culla il corpo senza vita di <span className="font-bold">Gesù</span>.
                    </p>
                   <p className="mb-4 line-height">Ospitata nella Basilica di San Pietro, mette in mostra la maestria dell'artista nel marmo e la sua profonda comprensione delle emozioni umane.
                    Le superfici lisce e le linee delicate della scultura trasmettono sia dolore che serenità, rendendola un capolavoro senza tempo del Rinascimento.</p>
                  <Link to="/pietas" className="btn-style mt-8">
                        Scopri di più
                    </Link>
                </div>
              </section>
              <section
                  id="michelangelo-second-statue-section"
                  className={`absolute top-[300vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
                      isMichelangeloSecondStatueVisible ? "opacity-100" : "opacity-0"
                   }`}
                >
                  <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
                      <h2 className="text-3xl font-bold mb-4">Statua del David</h2>
                    <p className="mb-4 line-height">
                        Il <span className="font-bold">David di Michelangelo</span>, creato tra il 1501 e il 1504, si erge come simbolo della forza fiorentina e della bellezza umana.
                    </p>
                    <p className="mb-4 line-height">Scolpita da un unico blocco di marmo, la colossale scultura raffigura l'eroe biblico David prima della sua battaglia con Golia. Con la sua anatomia muscolosa e l'espressione concentrata, rimane un capolavoro iconico della scultura rinascimentale, incarnando sia l'abilità artistica che il significato culturale.</p>
                      <Link to="/davide" className="btn-style mt-8">
                          Scopri di più
                      </Link>
                </div>
                <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[5, 5, 5]} intensity={1} />
                      <OrbitControls enableZoom={false} />
                      {isMichelangeloSecondStatueVisible && <David scale={[1, 1, 1]} rotation={rotation} />}
                </Canvas>
            </section>
    
                <section
                   id="michelangelo-third-statue-section"
                    className={`absolute top-[400vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
                        isMichelangeloThirdStatueVisible ? "opacity-100" : "opacity-0"
                   }`}
                >
                    <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <OrbitControls enableZoom={false} />
                       {isMichelangeloThirdStatueVisible && <Mosè scale={[1, 1, 1]} rotation={rotation} />}
                    </Canvas>
                    <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
                        <h2 className="text-3xl font-bold mb-4">Statua del Mosè</h2>
                        <p className="mb-4 line-height">
                        Il <span className="font-bold">Mosè di Michelangelo</span>, scolpito intorno al 1513-1515, è una figura dinamica e potente destinata alla tomba di Papa Giulio II.
                        </p>
                         <p className="mb-4 line-height">Raffigura il profeta biblico con le corna (una traduzione errata dell'ebraico) e una presenza imponente. Lo sguardo intenso e la forma muscolosa della statua evidenziano l'abilità di Michelangelo nel catturare l'emozione umana e la forza fisica nel marmo.</p>
                        <Link to="/moses" className="btn-style mt-8">
                            Scopri di più
                        </Link>
                    </div>
                </section>
        </div>
    );
};

export default Michelangelo;