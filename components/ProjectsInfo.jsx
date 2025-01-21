import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ProjectsInfo = ({ currentStage, position3D, rotation }) => {
  const { camera, size } = useThree();
  const [position2D, setPosition2D] = useState([0, 0]);

  useEffect(() => {
    if (position3D) {
      
      const rotatedPosition = new THREE.Vector3(position3D.x, position3D.y, position3D.z);
      rotatedPosition.applyEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z, 'XYZ')); // Apply the rotation to the position

     
      const vector = rotatedPosition.project(camera);

      
      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (vector.y * -0.5 + 0.5) * size.height;

      setPosition2D([x, y]);
    }
  }, [position3D, camera, size, rotation]);

  return renderContent[currentStage] ? (
    <div
      className="info-box"
      style={{
        left: `${position2D[0]}px`, 
        top: `${position2D[1]}px`,
        position: 'absolute', 
        pointerEvents: 'none', 
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
