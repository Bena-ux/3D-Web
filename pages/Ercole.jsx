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
          <h1 className="text-5xl text-shadow font-bold">Welcome to the Tour</h1>
          <p className="text-lg mt-4">Explore the endless possibilities of 3D art.</p>
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
            Experience Art in a New Dimension
          </h1>
          <p className="text-lg mt-4">Start your journey down below.</p>
        </div>
      </section>

      <section
        id="statue-section"
        className={`absolute top-[200vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
          isStatueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} />
          {isStatueVisible && <Farnese scale={[1, 1, 1]} rotation={rotation} />}
        </Canvas>
        <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-bold mb-4">Farnese Statue</h2>
          <p>Discover the rich history behind this magnificent artwork.</p>
          <Link to="/projects" className="btn-style mt-8">
            Learn More
          </Link>
        </div>
      </section>

      <section
        id="second-statue-section"
        className={`absolute top-[300vh] w-full h-screen flex justify-between items-center transition-opacity duration-700 ease-in-out ${
          isSecondStatueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Canvas className="w-1/2" onPointerDown={handleMouseDown}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enableZoom={false} />
          {isSecondStatueVisible && <Giambo scale={[1, 1, 1]} rotation={rotation} />}
        </Canvas>
        <div className="glass-panel w-1/2 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-bold mb-4">Giambo Statue</h2>
          <p>Explore the detail of another amazing creation.</p>
          <Link to="/giambologna" className="btn-style mt-8">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ercole;