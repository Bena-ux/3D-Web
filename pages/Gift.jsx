import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Farnese from '../models/Farnese.jsx';
import Giambo from '../models/Giambo.jsx';
import Omphales from '../models/Omphales.jsx';
import Pietà from '../models/Pietà.jsx';
import David from '../models/David.jsx';
import Mosè from '../models/Mosè.jsx';
import * as THREE from 'three';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gift = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isFirstVisible, setIsFirstVisible] = useState(true);
    const [isSecondVisible, setIsSecondVisible] = useState(false);
    const [isThirdVisible, setIsThirdVisible] = useState(false);
    const [isCarouselVisible, setIsCarouselVisible] = useState(false);
    const [isDayMode, setIsDayMode] = useState(true);
    const [currentStatueIndex, setCurrentStatueIndex] = useState(0);
     const [isTransitioning, setIsTransitioning] = useState(false);

    const statueRotation = useRef(0);
    const statuePosition = useRef(new THREE.Vector3());
    const fadeOpacity = useRef(1);
    const transitionProgress = useRef(0);
    const swipeDelta = useRef(0);
    const isDragging = useRef(false);
     const swipePosition = useRef(0);
    const swipeThreshold = 50;
    const nextStatueIndex = useRef(0);
    const nextStatuePosition = useRef(new THREE.Vector3());
    const transitionPhase = useRef('none');
     const initialStatuePosition = useRef(new THREE.Vector3());
     const swipeDirection = useRef('right');

    const statues = [
        { id: 1, name: 'Farnese Hercules', component: <Farnese scale={[0.65, 0.65, 0.65]} /> },
        { id: 2, name: 'Giambologna Hercules', component: <Giambo scale={[0.65, 0.65, 0.65]} /> },
        { id: 3, name: 'Omphales', component: <Omphales scale={[0.65, 0.65, 0.65]} isRotating={false} /> },
        { id: 4, name: 'Pietà', component: <Pietà scale={[0.65, 0.65, 0.65]} isRotating={false} /> },
        { id: 5, name: 'David', component: <David scale={[0.65, 0.65, 0.65]} isRotating={false} /> },
        { id: 6, name: 'Mosè', component: <Mosè scale={[0.65, 0.65, 0.65]} isRotating={false} /> },
    ];

   useEffect(() => {
        const currentHour = new Date().getHours();
        const initialMode = currentHour >= 7 && currentHour < 19;
        setIsDayMode(initialMode);

        document.body.classList.toggle('day-mode', initialMode);
        document.body.classList.toggle('night-mode', !initialMode);
    }, []);


    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        setIsFirstVisible(scrollY <= windowHeight * 0.5);
        setIsSecondVisible(scrollY > windowHeight * 0.5 && scrollY < windowHeight);
        setIsThirdVisible(scrollY >= windowHeight);
         setIsCarouselVisible(scrollY >= windowHeight * 1.5);
    }, [scrollY]);


    const handleMouseDown = (event) => {
         if (isTransitioning) return;
        isDragging.current = true;
        swipePosition.current = event.clientX;
    };

    const handleMouseMove = (event) => {
        if (!isDragging.current || isTransitioning) return;
        swipeDelta.current = event.clientX - swipePosition.current;
    };

   const handleMouseUp = () => {
        if (isTransitioning) return;
        isDragging.current = false;
        if (Math.abs(swipeDelta.current) > swipeThreshold) {
            initiateTransition(swipeDelta.current > 0 ? 'right' : 'left');
        }
          swipeDelta.current = 0;
        swipePosition.current = 0;
    };


    const initiateTransition = (direction) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        transitionPhase.current = 'fade-out';
         transitionProgress.current = 0;
        swipeDirection.current = direction;
        nextStatueIndex.current = direction === 'right'
            ? (currentStatueIndex + 1) % statues.length
            : (currentStatueIndex - 1 + statues.length) % statues.length;
        nextStatuePosition.current.set(direction === 'right' ? 1.5 : -1.5, 0, 0);
        fadeOpacity.current = 1;
        initialStatuePosition.current.copy(statuePosition.current);
    };


   useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const AnimatedStatues = () => {
         const statueRef = useRef();
        const currentStatuePosition = useRef(new THREE.Vector3());
        const targetStatuePosition = useRef(new THREE.Vector3());
        const initialTransitionPosition = useRef(new THREE.Vector3());

        useFrame(() => {
            if (!isDragging.current) {
                statueRotation.current += 0.005;
            }
            if (isTransitioning) {
                 switch (transitionPhase.current) {
                      case 'fade-out':
                         transitionProgress.current = Math.min(1, transitionProgress.current + 0.05);
                         fadeOpacity.current = THREE.MathUtils.lerp(1, 0, transitionProgress.current);
                         currentStatuePosition.current.lerpVectors(initialTransitionPosition.current, targetStatuePosition.current, transitionProgress.current)
                        statuePosition.current.copy(currentStatuePosition.current);
                        if (transitionProgress.current >= 1) {
                             transitionPhase.current = 'move';
                             transitionProgress.current = 0;
                             setCurrentStatueIndex(nextStatueIndex.current)
                        }
                        break;
                     case 'move':
                         transitionProgress.current = Math.min(1, transitionProgress.current + 0.05);
                         if (transitionProgress.current >= 1) {
                             transitionPhase.current = 'fade-in';
                             transitionProgress.current = 0;
                            statuePosition.current.copy(targetStatuePosition.current);
                        }
                        break;
                    case 'fade-in':
                        transitionProgress.current = Math.min(1, transitionProgress.current + 0.05);
                        fadeOpacity.current = THREE.MathUtils.lerp(0, 1, transitionProgress.current);
                        if (transitionProgress.current >= 1) {
                            fadeOpacity.current = 1;
                           setIsTransitioning(false);
                            transitionPhase.current = 'none';
                        }
                         break;
                    default:
                         break;
                }
           } else {
                currentStatuePosition.current.copy(statuePosition.current)
            }


             if (statueRef.current) {
                statueRef.current.rotation.y = statueRotation.current;
            }
            if (isDragging.current && !isTransitioning) {
                 statuePosition.current.x = swipeDelta.current / 50;
             } else if (!isTransitioning) {
               statuePosition.current.set(0, 0, 0);
           }

        });
        const statueMesh = (
            <mesh opacity={fadeOpacity.current} onPointerDown={handleMouseDown}>
                {statues[currentStatueIndex].component}
            </mesh>
        );
        return (
            <group position={statuePosition.current} ref={statueRef}>
                {statueMesh}
            </group>
        );
    };


    return (
        <div className="w-full h-[300vh] relative">
            {/* First rectangle */}
            <section
                className={`absolute top-0 w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
                ${isFirstVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
                    isDayMode ? 'text-slate-900' : 'text-slate-100'
                }`}
            >
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Acquista il tuo modello 3D!</h1>
                    <p className="text-lg mt-4">Supporta l'iniziativa!</p>
                </div>
            </section>

            {/* Second rectangle */}
            <section
                className={`absolute top-[100vh] w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
              ${isSecondVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
                    isDayMode ? 'text-slate-900' : 'text-slate-100'
                }`}
            >
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Seleziona il tuo preferito!</h1>
                    <p className="text-lg mt-4">
                        Puoi acquistare le nostre statue come modelli 3D stampati per portare l'arte a casa tua!
                    </p>
                </div>
            </section>

            {/* Statue Carousel */}
            <section
                className={`absolute top-[200vh] w-full h-screen  flex justify-center items-center transition-opacity duration-700 ease-in-out
              ${isCarouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div
                    style={{ width: '50%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <button
                        onClick={() => initiateTransition('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10 opacity-50 hover:opacity-100"
                    >
                        <FaChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => initiateTransition('right')}
                         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10 opacity-50 hover:opacity-100"
                    >
                        <FaChevronRight size={24} />
                    </button>
                    <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 1, 3] }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <OrbitControls enableZoom={false} />
                         <AnimatedStatues />
                    </Canvas>
                </div>
            </section>
           {/* Purchase button is outside of the carousel section, but inside the main div container */}
                <div className="absolute bottom-10 left-0 w-full flex justify-center">
                   <button className="btn-style">
                        Acquista
                    </button>
                </div>
        </div>
    );
};

export default Gift;