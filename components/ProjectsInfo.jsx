import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ProjectsInfo = ({ currentStage, position3D, rotation }) => {
  const { camera, size } = useThree();
  const [position2D, setPosition2D] = useState([0, 0]);

  useEffect(() => {
    if (position3D) {
      // Adjust position based on rotation
      const rotatedPosition = new THREE.Vector3(position3D.x, position3D.y, position3D.z);
      rotatedPosition.applyEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z, 'XYZ')); // Apply the rotation to the position

      // Convert the 3D position of the model to screen-space coordinates
      const vector = rotatedPosition.project(camera);

      // Convert normalized device coordinates to pixel values
      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (vector.y * -0.5 + 0.5) * size.height;

      setPosition2D([x, y]);
    }
  }, [position3D, camera, size, rotation]);

  return renderContent[currentStage] ? (
    <div
      className="info-box"
      style={{
        left: `${position2D[0]}px`, // Set position based on screen coordinates
        top: `${position2D[1]}px`,
        position: 'absolute', // Absolute position relative to the screen
        pointerEvents: 'none', // Prevent interference with 3D interactions
      }}
    >
      {renderContent[currentStage]}
    </div>
  ) : null;
};

const renderContent = {
  1: (
    <div>
      <h1>Ercole <span className="font-semibold">Farnese</span></h1>
      <p>Information about stage 1.</p>
    </div>
  ),
  2: (
    <div>
      <h1>Stage 2 Info</h1>
      <p>Details about stage 2.</p>
    </div>
  ),
  3: (
    <div>
      <h1>Stage 3 Info</h1>
      <p>Details about stage 3.</p>
    </div>
  ),
  4: (
    <div>
      <h1>Stage 4 Info</h1>
      <p>Details about stage 4.</p>
    </div>
  ),
};

export default ProjectsInfo;
