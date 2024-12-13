import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Omphales from "../models/Omphales";

const Omph = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [omphalesScale, setOmphalesScale] = useState([1, 1, 1]);
  const [omphalesPosition, setOmphalesPosition] = useState([0, 1.5, 0]);
  const [omphalesRotation, setOmphalesRotation] = useState([0.1, 4.7, 0]);
  const [isDayMode, setIsDayMode] = useState(true); // Placeholder for toggling light themes

  // Dynamically adjust scale, position, and rotation based on screen size
  useEffect(() => {
    const adjustOmphalesForScreenSize = () => {
      const scale = window.innerWidth < 768 ? [0.9, 0.9, 0.9] : [2.2, 2.2, 2.2];
      setOmphalesScale(scale);
      setOmphalesPosition([0, -1, 0]); // Keeps position constant
      setOmphalesRotation([0.1, 4.7, 0]); // Keeps rotation constant
    };

    adjustOmphalesForScreenSize();
    window.addEventListener("resize", adjustOmphalesForScreenSize);

    return () => window.removeEventListener("resize", adjustOmphalesForScreenSize);
  }, []);

  // Info panel content for stages
  const infoContent = {
    1: {
      title: "The Omphales Hercules",
      description: "A monumental sculpture of Hercules resting after completing the Twelve Labors.",
    },
    2: {
      title: "Greek Origins",
      description: "The statue is a Roman copy of a Greek original by Lysippos, dating back to 3rd century BCE.",
    },
    3: {
      title: "Artistic Significance",
      description: "Known for its exaggerated musculature and depiction of weariness, symbolizing human struggle.",
    },
    4: {
      title: "Rediscovery",
      description: "Rediscovered in the 16th century, it became a cornerstone of Renaissance and Baroque art.",
    },
  };

  return (
    <section className="w-full h-screen relative transition-colors">
      {/* 3D Canvas */}
      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000, position: [0, 0, 10] }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight
            skyColor={isDayMode ? "#87CEEB" : "#1E293B"}
            groundColor="#000000"
            intensity={1}
          />

          {/* Omphales Model */}
          <Omphales
            position={omphalesPosition}
            scale={omphalesScale}
            rotation={omphalesRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
        </Suspense>
      </Canvas>

      {/* Info Panel */}
      <div
        className="absolute top-10 left-10 p-6 w-80 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
        style={{ zIndex: 100 }}
      >
        <h1 className="text-2xl font-bold">{infoContent[currentStage]?.title || "Loading..."}</h1>
        <p className="mt-2 text-sm">
          {infoContent[currentStage]?.description || "Rotate the statue to explore more."}
        </p>
      </div>
    </section>
  );
};

export default Omph;
