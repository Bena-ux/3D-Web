import { useRef, useState, useEffect, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { a } from "@react-spring/three";
import * as THREE from "three";

import omphalesScene from "../assets/3d/omphales.glb";

const Omphales = ({ isRotating: initialRotating, setIsRotating, onStageChange = () => {}, ...props }) => {
    const omphalesRef = useRef();
    const { gl, viewport, scene } = useThree();
    const { nodes, scene: gltfScene } = useGLTF(omphalesScene);
    const [currentStage, setCurrentStage] = useState(1);
    const [isRotatingLocal, setIsRotatingLocal] = useState(initialRotating);


    // Add a neutral material
    const neutralMaterial = new THREE.MeshStandardMaterial({
      color: "#d4d4d4",
        roughness: 0.5,
        metalness: 0.2,
    });

    // Add lights to enhance visibility
    useEffect(() => {
      const directionalLight = new THREE.DirectionalLight("#ffffff", 1.2);
      directionalLight.position.set(2, 5, 2);
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
      scene.add(ambientLight);

      return () => {
        scene.remove(directionalLight, ambientLight);
      };
    }, [scene]);


    const lastX = useRef(0);
    const rotationSpeed = useRef(0);
    const dampingFactor = 0.95;


    const handlePointerDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotatingLocal(true);
        setIsRotating(true)

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;

        lastX.current = clientX;
    };

    const handlePointerUp = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotatingLocal(false);
        setIsRotating(false)
    };

    const handlePointerMove = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isRotatingLocal) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;

            const delta = (clientX - lastX.current) / viewport.width;

            omphalesRef.current.rotation.y += delta * 0.01 * Math.PI;
            lastX.current = clientX;
            rotationSpeed.current = delta * 0.01 * Math.PI;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            if (!isRotatingLocal) setIsRotatingLocal(true);
            setIsRotating(true);
            omphalesRef.current.rotation.y += 0.01 * Math.PI;
        } else if (e.key === "ArrowRight") {
            if (!isRotatingLocal) setIsRotatingLocal(true);
            setIsRotating(true);
            omphalesRef.current.rotation.y -= 0.01 * Math.PI;
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            setIsRotatingLocal(false);
            setIsRotating(false);
        }
    };

    const calculateStage = (rotationY) => {
      const normalizedRotation = (rotationY + Math.PI * 2) % (Math.PI * 2);
        if (normalizedRotation < Math.PI / 2) return 1;
        if (normalizedRotation < Math.PI) return 2;
        if (normalizedRotation < (3 * Math.PI) / 2) return 3;
        return 4;
    };

  useFrame(() => {
    if (!isRotatingLocal) {
      rotationSpeed.current *= dampingFactor;

      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      omphalesRef.current.rotation.y += rotationSpeed.current;
    }

    const stage = calculateStage(omphalesRef.current.rotation.y);
    setCurrentStage(stage);
      onStageChange(stage);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

    return (
      <Suspense fallback={null}>
        <a.group ref={omphalesRef} {...props}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
              {nodes ? (
                <>
                  <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes?.Object_2?.geometry}
                      material={neutralMaterial}
                    />
                  <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes?.Object_3?.geometry}
                      material={neutralMaterial}
                    />
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes?.Object_4?.geometry}
                      material={neutralMaterial}
                    />
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes?.Object_5?.geometry}
                      material={neutralMaterial}
                    />
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes?.Object_6?.geometry}
                      material={neutralMaterial}
                    />
                </>
                ) : null}
            </group>
        </a.group>
      </Suspense>
    );
};

export default Omphales;