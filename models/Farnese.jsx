
import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';
import { a } from '@react-spring/three';
import * as THREE from "three";

import farneseScene from '../assets/3d/farnese.glb'

const Farnese = ({isRotating, setIsRotating, setCurrentStage, metadata, ...props}) => {
  const farneseRef = useRef();
   
  const {gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(farneseScene);
  
const lastX =useRef(0);
const rotationSpeed = useRef(0);
const dampingFactor = 0.95;

const handlePointerDown = (e) => {
e.stopPropagation();
e.preventDefault();
setIsRotating(true);
 

const clientX = e.touches 
? e.touches[0].clientX 
: e.clientX;

lastX.current = clientX;
}


const handlePointerUp = (e) => {
  e.stopPropagation();
  e.preventDefault();
  setIsRotating(false);
}

const handlePointerMove = (e) => {
e.stopPropagation();
e.preventDefault();

if(isRotating) {
  
  const clientX = e.touches 
    ? e.touches[0].clientX 
    : e.clientX;

    const delta = (clientX -lastX.current) / viewport.width;

    farneseRef.current.rotation.y += delta * 0.01 * Math.PI;
    lastX.current = clientX;
    rotationSpeed.current = delta * 0.01 * Math.PI;
  }
} 

const handleKeyDown = (e) => {
  if(e.key === 'ArrowLeft') {
    if(!isRotating) setIsRotating(true);
    farneseRef.current.rotation.y += 0.01 * Math.PI;
  } else if (e.key === 'ArrowRight') {
    if(!isRotating) setIsRotating(true);
    farneseRef.current.rotation.y -= 0.01 * Math.PI;
  }
}

const handleKeyUp = (e) => {
  if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    setIsRotating(false);
  }
}


useFrame(() => {
  if(!isRotating){
    rotationSpeed.current *= dampingFactor;

    if(Math.abs(rotationSpeed.current) < 0.001) {
      rotationSpeed.current = 0;
    }

    farneseRef.current.rotation.y += rotationSpeed.current;
  } else {
    const rotation = farneseRef.current.rotation.y;

    const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
  }
})

useEffect(() => {
  const canvas = gl.domElement;
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  return () => {
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  }
}, [gl, handlePointerDown, handlePointerUp, handlePointerMove])

  return (
    <a.group ref={farneseRef} {...props} >
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.17}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.material_0}
        />
        <mesh 
          geometry={nodes.Object_3.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_10.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials.material_0}
        />
        <mesh
          geometry={nodes.Object_12.geometry}
          material={materials.material_0}
        />
      </group>
         {metadata && <pre>  {JSON.stringify(metadata, null, 2)} </pre>}
    </a.group>
  )
}


export default Farnese;