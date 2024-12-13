import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Farnese from '../models/Farnese';

const Projects = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isDayMode, setIsDayMode] = useState(true); // Track day/night mode

  const adjustFarneseForScreenSize = () => {
    let screenScale = [1, 1, 1];
    let screenPosition = [0, 1.5, 0]; // Center the statue
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [2.2, 2.2, 2.2];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [farneseScale, farnesePosition, farneseRotation] = adjustFarneseForScreenSize();

  const infoContent = {
    1: {
      title: 'The Farnese Hercules',
      description: 'A monumental sculpture of Hercules resting after completing the Twelve Labors.',
    },
    2: {
      title: 'Greek Origins',
      description: 'The statue is a Roman copy of a Greek original by Lysippos, dating back to 3rd century BCE.',
    },
    3: {
      title: 'Artistic Significance',
      description: 'Known for its exaggerated musculature and depiction of weariness, symbolizing human struggle.',
    },
    4: {
      title: 'Rediscovery',
      description: 'Rediscovered in the 16th century, it became a cornerstone of Renaissance and Baroque art.',
    },
  };

  return (
    <section
      className="w-full h-screen relative transition-colors"
     
    >
      {/* 3D Canvas */}
      <Canvas
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
        camera={{ near: 0.1, far: 1000, position: [0, 0, 10] }} // Position camera to properly view the statue
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight
            skyColor={isDayMode ? '#87CEEB' : '#1E293B'}
            groundColor="#000000"
            intensity={1}
          />

          <Farnese
            position={farnesePosition}
            scale={farneseScale}
            rotation={farneseRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
        </Suspense>
      </Canvas>

      {/* Glassmorphism Info Panels */}
      <div
        className="absolute top-10 left-10 p-6 w-80 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
        style={{ zIndex: 100 }}
      >
        <h1 className="text-2xl font-bold">{infoContent[currentStage]?.title || 'Loading...'}</h1>
        <p className="mt-2 text-sm">
          {infoContent[currentStage]?.description || 'Rotate the statue to explore more.'}
        </p>
      </div>
    </section>
  );
};

export default Projects;
