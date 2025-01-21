import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Giambo from "../models/Giambo";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

const Giambologna = () => {
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [giamboScale, setGiamboScale] = useState([1, 1, 1]);
    const [giamboPosition, setGiamboPosition] = useState([0, 1.5, 0]);
    const [giamboRotation, setGiamboRotation] = useState([0.1, 4.7, 0]);
    const [isDayMode, setIsDayMode] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [isTopVisible, setIsTopVisible] = useState(true);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
    const [isBottomVisible, setIsBottomVisible] = useState(false);
    const canvasRef = useRef(null);
    const metadataPanelRef = useRef(null);
    const panelContentRef = useRef(null);
    const [panelWidth, setPanelWidth] = useState(0);
    const [isMetadataPanelVisible, setIsMetadataPanelVisible] = useState(false);
    const [isDcPanelVisible, setIsDcPanelVisible] = useState(false);
    const [isXmlPanelVisible, setIsXmlPanelVisible] = useState(false);
    const [teiContent, setTeiContent] = useState({
        title: "",
        author: "",
        language: "",
        timePeriod: "",
        workType: "",
        source: "",
        translationSource: "",
        translator: "",
        greekText: "",
        translationText: ""
    });
    const [xmlContent, setXmlContent] = useState({
        subject: "",
        materials: "",
        style: "",
        height: "",
        weight: "",
    });
    const [dcContent, setDcContent] = useState({
        title: "",
        creator: "",
        date: "",
        format: "",
        description: "",
        rights: "",
    });
    const [dcDataString, setDcDataString] = useState("");
     const [xmlDataString, setXmlDataString] = useState("");


    const giamboTEI = new URL('../data/tei/giambo.tei', import.meta.url).href;
    const giamboXML = new URL('../data/xml/giambo.xml', import.meta.url).href;
    const giamboDC = new URL('../data/dc/giambo-dc.json', import.meta.url).href;


    useEffect(() => {
        const parseTei = (xmlString) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            const title = xmlDoc.querySelector('titleStmt title')?.textContent || 'N/A';
            const author = xmlDoc.querySelector('titleStmt author')?.textContent || 'N/A';
            const language = xmlDoc.querySelector('langUsage > language')?.getAttribute('ident') || 'N/A';
            const timePeriod = xmlDoc.querySelector('creation > date[type="timePeriod"]')?.textContent || 'N/A';
            const workType = xmlDoc.querySelector('creation > rs[type="workType"]')?.textContent || 'N/A';
             const sourceElement = xmlDoc.querySelector('sourceDesc bibl[type="url"]');
            const source = sourceElement ? sourceElement.getAttribute('target') : 'N/A';
            const translationSource = xmlDoc.querySelector('sourceDesc bibl:nth-of-type(2)')?.textContent || 'N/A';
            const translator = xmlDoc.querySelector('sourceDesc bibl:last-of-type')?.textContent || 'N/A';
            const ancientGreekText = Array.from(xmlDoc.querySelectorAll('div[type="ancientGreek"] l')).map(l => l.textContent).join('\n') || '';
            const translationText = Array.from(xmlDoc.querySelectorAll('div[type="translation"] p')).map(p => p.textContent).join('\n') || '';


            return {
                title,
                author,
                language,
                timePeriod,
                workType,
                source,
                translationSource,
                translator,
                greekText: ancientGreekText,
                translationText: translationText,
            };
        };


        const parseXML = (xmlString) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            const subject = xmlDoc.querySelector('subject')?.textContent || 'N/A';
            const materials = xmlDoc.querySelector('materials')?.textContent || 'N/A';
            const style = xmlDoc.querySelector('style')?.textContent || 'N/A';
            const height = xmlDoc.querySelector('height')?.textContent || 'N/A';
            const weight = xmlDoc.querySelector('weight')?.textContent || 'N/A';

            return { subject, materials, style, height, weight };

        };
        const fetchTeiData = async () => {
            try {
                const response = await fetch(giamboTEI);
                const xmlString = await response.text();
                const parsed = parseTei(xmlString);
                setTeiContent(parsed);
            } catch (error) {
                console.error("Error fetching TEI data:", error);
            }
        };

        const fetchXMLData = async () => {
            try {
                const response = await fetch(giamboXML);
                const xmlString = await response.text();
                const parsed = parseXML(xmlString);
                setXmlContent(parsed);
                 setXmlDataString(xmlString);
            } catch (error) {
                console.error("Error fetching XML data:", error);
            }
        };

       const fetchDCData = async () => {
            try {
                const response = await fetch(giamboDC);
                const jsonData = await response.json();
                setDcContent(jsonData[0] || {});
                 setDcDataString(JSON.stringify(jsonData[0], null, 2));
            } catch (error) {
                console.error("Error fetching DC data:", error);
            }
        };
        fetchTeiData();
        fetchXMLData();
        fetchDCData();
    }, []);

    useEffect(() => {
        const adjustGiamboForScreenSize = () => {
            const scale = window.innerWidth < 768 ? [0.9, 0.9, 0.9] : [2.2, 2.2, 2.2];
            setGiamboScale(scale);
            setGiamboPosition([0, -1, 0]);
            setGiamboRotation([0.1, 4.7, 0]);
        };

        adjustGiamboForScreenSize();
        window.addEventListener("resize", adjustGiamboForScreenSize);

        return () => window.removeEventListener("resize", adjustGiamboForScreenSize);
    }, []);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const canvasHeight = canvasRef.current ? canvasRef.current.clientHeight : window.innerHeight;

        if (scrollY < canvasHeight * 0.5) {
            setIsTopVisible(true);
            setIsBottomVisible(false);
        } else {
            setIsTopVisible(false);
            setIsBottomVisible(true);
        }
    }, [scrollY]);

    useEffect(() => {
        if (panelContentRef.current) {
            setPanelWidth(panelContentRef.current.offsetWidth);
        }
    }, [isMetadataPanelVisible]);

   const handleMetadataToggle = () => {
        setIsMetadataPanelVisible(!isMetadataPanelVisible);
        setIsDcPanelVisible(false);
        setIsXmlPanelVisible(false);
    };
    const handleDCToggle = () => {
        setIsDcPanelVisible(!isDcPanelVisible);
        setIsMetadataPanelVisible(false);
         setIsXmlPanelVisible(false);
    };
    const handleXMLToggle = () => {
        setIsXmlPanelVisible(!isXmlPanelVisible);
        setIsMetadataPanelVisible(false);
         setIsDcPanelVisible(false);

    };
    const handleMetadataHover = () => {
        setIsMetadataPanelVisible(true);
    };

     const handleDataPanelLeave = (event) => {
         if(metadataPanelRef.current && !metadataPanelRef.current.contains(event.relatedTarget)){
             setIsMetadataPanelVisible(false)
             setIsDcPanelVisible(false)
             setIsXmlPanelVisible(false)
         }
     }

    const handleMetadataLeave = (event) => {
        if (metadataPanelRef.current && !metadataPanelRef.current.contains(event.relatedTarget)) {
            setIsMetadataPanelVisible(false);
        }
    };

    const infoContent = {
        1: {
            title: "The Giambologna Hercules",
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

    const handleStageChange = (stage) => {
        setCurrentStage(stage);
    };


    return (
        <section className="w-full h-[200vh] relative transition-colors">
            {/* 3D Canvas */}
            <div
                ref={canvasRef}
                className={`w-full h-screen absolute top-0 left-0 ${
                    isTopVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } transition-opacity duration-700 ease-in-out`}
            >
                <Canvas
                    className={`w-full h-screen bg-transparent ${
                        isRotating ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    camera={{ near: 0.1, far: 1000, position: [0, 0, 10] }}
                >
                    {/* Lighting */}
                    <directionalLight position={[5, 5, 5]} intensity={2} />
                    <ambientLight intensity={0.5} />
                    <hemisphereLight
                        skyColor={isDayMode ? "#87CEEB" : "#1E293B"}
                        groundColor="#000000"
                        intensity={1}
                    />

                    {/* Giambo Model */}
                    <Giambo
                        position={giamboPosition}
                        scale={giamboScale}
                        rotation={giamboRotation}
                        isRotating={isRotating}
                        setIsRotating={setIsRotating}
                        onStageChange={handleStageChange}
                    />
                </Canvas>
                {/* Info Panel */}
                <div
                    className="glass-panel absolute top-10 left-10 p-6 w-80  rounded-xl shadow-lg"
                    style={{ zIndex: 100 }}
                >
                    <h1 className="text-2xl font-bold">{infoContent[currentStage]?.title || "Loading..."}</h1>
                    <p className="mt-2 text-sm">
                        {infoContent[currentStage]?.description || "Rotate the statue to explore more."}
                    </p>
                </div>
                 {!isMetadataPanelVisible && !isDcPanelVisible && !isXmlPanelVisible &&(
                     <button
                        onMouseEnter={handleMetadataHover}
                        onMouseLeave={handleMetadataLeave}
                        className="glass-panel absolute top-10 right-10 btn-style"
                        style={{ zIndex: 101 }}
                        onClick={handleMetadataToggle}
                    >
                        Mostra Metadati
                    </button>
                )}
                   <div
                    className={`absolute top-0 right-0 h-[90vh] w-96 transition-all duration-500 ease-in-out origin-top-right transform
                    ${isMetadataPanelVisible || isDcPanelVisible || isXmlPanelVisible
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                    }`}
                >
                    {/* Right Panel */}
                      {/*Metadata Panel */}
                     {isMetadataPanelVisible && (
                        <section
                           ref={metadataPanelRef}
                           className={`glass-panel h-full w-full p-6 flex flex-col`}
                            onMouseLeave={handleDataPanelLeave}
                        >
                           <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                               <h2 className="text-3xl font-bold mb-4 panel-section-title">About the Sculpture</h2>
                               <p className="text-sm mt-2 panel-item"><span className="font-medium">Title:</span> {dcContent.title}</p>
                               <p className="text-sm mt-2 panel-item"><span className="font-medium">Creator:</span> {dcContent.creator}</p>
                               <p className="text-sm mt-2 panel-item"><span className="font-medium">Date:</span> {dcContent.date}</p>
                               <p className="text-sm mt-2 panel-item"><span className="font-medium">Format:</span> {dcContent.format}</p>
                               <p className="text-sm mt-2 panel-item"><span className="font-medium">Rights:</span> {dcContent.rights}</p>
                               <h2 className="text-xl font-bold mt-4 panel-section-title">Metadata</h2>
                               <p className="mt-2 text-sm panel-item"> <span className="font-medium">Subject:</span> {xmlContent.subject}</p>
                               <p className="mt-2 text-sm panel-item">
                                   <span className="font-medium">Materials:</span> {xmlContent.materials}
                               </p>
                               <p className="mt-2 text-sm panel-item">
                                   <span className="font-medium">Style:</span> {xmlContent.style}
                               </p>
                               <p className="mt-2 text-sm panel-item">
                                   <span className="font-medium">Height:</span> {xmlContent.height}
                               </p>
                               <p className="mt-2 text-sm panel-item">
                                   <span className="font-medium">Weight:</span> {xmlContent.weight}
                               </p>
                           </div>
                            <div className="mt-auto mb-4 flex justify-center space-x-2">
                                <button
                                    className="glass-panel  btn-style"
                                    onClick={handleDCToggle}
                                >
                                    DC
                                </button>
                                <button
                                    className="glass-panel  btn-style"
                                    onClick={handleXMLToggle}
                                >
                                    XML
                                </button>
                            </div>
                       </section>
                    )}
                   {/*DC Panel*/}
                   {isDcPanelVisible && (
                         <section
                            ref={metadataPanelRef}
                            className={`glass-panel h-screen w-full p-6 flex flex-col`}
                             onMouseLeave={handleDataPanelLeave}
                        >
                            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                                <h2 className="text-3xl font-bold mb-4 panel-section-title">DC Metadata</h2>
                                <pre className="text-sm mt-2 whitespace-pre-wrap">{dcDataString}</pre>
                            </div>
                             <div className="mt-auto mb-4 flex justify-center space-x-2">
                                <button
                                    className="glass-panel  btn-style"
                                     onClick={handleMetadataToggle}
                                >
                                    Metadati
                                </button>
                                  <button
                                    className="glass-panel  btn-style"
                                    onClick={handleXMLToggle}
                                >
                                    XML
                                </button>
                            </div>
                        </section>
                    )}
                      {/*XML Panel*/}
                    {isXmlPanelVisible && (
                       <section
                           ref={metadataPanelRef}
                           className={`glass-panel h-screen w-full p-6 flex flex-col`}
                           onMouseLeave={handleDataPanelLeave}
                       >
                           <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                               <h2 className="text-3xl font-bold mb-4 panel-section-title">XML Metadata</h2>
                               <pre className="text-sm mt-2 whitespace-pre-wrap">{xmlDataString}</pre>
                           </div>
                            <div className="mt-auto mb-4 flex justify-center space-x-2">
                                 <button
                                    className="glass-panel  btn-style"
                                    onClick={handleMetadataToggle}
                                >
                                    Metadati
                                </button>
                                  <button
                                    className="glass-panel  btn-style"
                                    onClick={handleDCToggle}
                                >
                                    DC
                                </button>
                            </div>
                       </section>
                    )}
                </div>
            </div>

            {/* Bottom Panel */}
            <section
                className={`absolute top-[100vh] w-full h-screen flex justify-center items-center glass-panel transition-opacity duration-700 ease-in-out
                    ${isBottomVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ minHeight: "100vh" }}
            >
                <div className="text-center relative">
                    <h1 className="text-4xl text-shadow font-bold">Explore More of Giambologna's Work</h1>
                    <p className="text-lg mt-4">Scroll up to see more.</p>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold mt-4 panel-section-title">The Shield Of Heracles</h2>
                        <div className="mt-4 text-sm">
                            <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                                {teiContent.greekText}
                            </p>

                            <p style={{ whiteSpace: 'pre-line' }}>
                                {teiContent.translationText}
                            </p>
                        </div>
                        <div
                            className="glass-panel p-2 mt-2"

                        >
                            <div ref={panelContentRef} style={{ textAlign: 'left' }}>
                                <h2 className="text-xl font-bold mt-4 panel-section-title">About this Text</h2>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Title:</span> {teiContent.title}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Author:</span> {teiContent.author}
                                </p>
                                 <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Language:</span> {teiContent.language === 'grc' ? 'Ancient Greek' : teiContent.language}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Time Period:</span> {teiContent.timePeriod}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Work Type:</span> {teiContent.workType}
                                </p>
                               
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Translation Source:</span> {teiContent.translationSource}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Translator:</span> {teiContent.translator}
                                </p>
                            </div>
                            <div className='flex justify-center'>
                                <a
                                    href={teiContent.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-panel p-2 mt-4 btn-style"
                                >
                                    Go to Text Source
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Giambologna;