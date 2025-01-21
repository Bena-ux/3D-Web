import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Omphales from '../models/Omphales';

const Omph = () => {
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [omphalesScale, setOmphalesScale] = useState([1, 1, 1]);
    const [omphalesPosition, setOmphalesPosition] = useState([0, 1.5, 0]);
    const [omphalesRotation, setOmphalesRotation] = useState([0.1, 4.7, 0]);
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
    const omphaleTEI = new URL('../data/tei/omphale.tei', import.meta.url).href;
    const omphaleXML = new URL('../data/xml/omphale.xml', import.meta.url).href;
    const omphaleDC = new URL('../data/dc/omphale-dc.json', import.meta.url).href;

    useEffect(() => {
        const parseTei = (xmlString) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            const title = xmlDoc.querySelector('titleStmt title')?.textContent || 'N/A';
            const author = xmlDoc.querySelector('titleStmt author')?.textContent || 'N/A';
            const language = xmlDoc.querySelector('profileDesc > langUsage > language')?.getAttribute('ident') || 'N/A';
            const timePeriod = xmlDoc.querySelector('profileDesc > creation > date[type="timePeriod"]')?.textContent || 'N/A';
            const workType = xmlDoc.querySelector('profileDesc > creation > rs[type="workType"]')?.textContent || 'N/A';

             const sourceElement = xmlDoc.querySelector('sourceDesc bibl[type="url"]');
            const source = sourceElement ? sourceElement.getAttribute('target') : 'N/A';
            const translationSource = xmlDoc.querySelector('sourceDesc bibl:nth-of-type(2)')?.textContent || 'N/A';
            const translator = xmlDoc.querySelector('sourceDesc bibl:last-of-type')?.textContent || 'N/A';
             // Extract lines for greek, paragraphs for translations
            const ancientGreekText = Array.from(xmlDoc.querySelectorAll('div[type="originalQuote"] l')).map(l => l.textContent).join('\n') || '';
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
                const response = await fetch(omphaleTEI);
                const xmlString = await response.text();
                const parsed = parseTei(xmlString);
                setTeiContent(parsed);
            } catch (error) {
                console.error("Error fetching TEI data:", error);
            }
        };

        const fetchXMLData = async () => {
            try {
                const response = await fetch(omphaleXML);
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
                const response = await fetch(omphaleDC);
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
        const adjustOmphalesForScreenSize = () => {
            const scale = window.innerWidth < 768 ? [0.9, 0.9, 0.9] : [2.2, 2.2, 2.2];
            setOmphalesScale(scale);
            setOmphalesPosition([0, -1, 0]);
            setOmphalesRotation([0.1, 4.7, 0]);
        };

        adjustOmphalesForScreenSize();
        window.addEventListener("resize", adjustOmphalesForScreenSize);

        return () => window.removeEventListener("resize", adjustOmphalesForScreenSize);
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
            title: "L'Ercole di Onfale",
            description: "Una rappresentazione unica di Ercole al servizio della regina Onfale.",
        },
        2: {
            title: "Il Mito di Onfale",
            description: "La statua illustra un episodio in cui Ercole si trova sottomesso all'autorità di una regina.",
        },
        3: {
            title: "Significato dell'Opera",
            description: "Rappresenta la temporanea sottomissione della forza alla volontà di un potere superiore.",
        },
        4: {
           title: "Rarità e Rappresentazione",
           description: "Una scultura insolita che evidenzia l'umiliazione temporanea dell'eroe.",
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
                className={`w-full h-screen absolute top-0 left-0 ${isTopVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    } transition-opacity duration-700 ease-in-out`}
            >
                <Canvas
                    className={`w-full h-screen bg-transparent ${isRotating ? "cursor-grabbing" : "cursor-grab"
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

                        {/* Giambo Model */}
                        <Omphales
                            position={omphalesPosition}
                            scale={omphalesScale}
                            rotation={omphalesRotation}
                            isRotating={isRotating}
                            setIsRotating={setIsRotating}
                            onStageChange={handleStageChange}
                        />
                    </Suspense>
                </Canvas>
                {/* Info Panel */}
                <div
                    className="glass-panel absolute top-10 left-10 p-6 w-80  rounded-xl shadow-lg"
                    style={{ zIndex: 100 }}
                >
                    <h1 className="text-2xl font-bold">{infoContent[currentStage]?.title || "Loading..."}</h1>
                    <p className="mt-2 text-sm">
                        {infoContent[currentStage]?.description || "Ruota la statua per esplorare di più."}
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
                                <h2 className="text-3xl font-bold mb-4 panel-section-title">Informazioni sulla Scultura</h2>
                                <p className="text-sm mt-2 panel-item"><span className="font-medium">Titolo:</span> {dcContent.title}</p>
                                <p className="text-sm mt-2 panel-item"><span className="font-medium">Creatore:</span> {dcContent.creator}</p>
                                <p className="text-sm mt-2 panel-item"><span className="font-medium">Data:</span> {dcContent.date}</p>
                                <p className="text-sm mt-2 panel-item"><span className="font-medium">Formato:</span> {dcContent.format}</p>
                                <p className="text-sm mt-2 panel-item"><span className="font-medium">Diritti:</span> {dcContent.rights}</p>
                                <h2 className="text-xl font-bold mt-4 panel-section-title">Metadati</h2>
                                <p className="mt-2 text-sm panel-item"> <span className="font-medium">Soggetto:</span> {xmlContent.subject}</p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Materiali:</span> {xmlContent.materials}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Stile:</span> {xmlContent.style}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Altezza:</span> {xmlContent.height}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Peso:</span> {xmlContent.weight}
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
                    <h1 className="text-4xl text-shadow font-bold">Scopri di Più sull'Ercole Omphale</h1>
                    <p className="text-lg mt-4">Scorri verso l'alto per vedere altro.</p>
                     <div className="flex flex-col items-center">
                         <h2 className="text-xl font-bold mt-4 panel-section-title">Greco Antico</h2>
                        <div className="mt-4 text-sm" style={{overflowWrap: 'break-word'}}>
                             {teiContent.greekText && <p style={{whiteSpace: 'pre-line'}}>
                                 {teiContent.greekText}
                            </p>}
                           <h2 className="text-xl font-bold mt-4 panel-section-title">Traduzione</h2>
                            {teiContent.translationText &&  <p style={{whiteSpace: 'pre-line'}}>
                                 {teiContent.translationText}
                            </p>}
                        </div>
                         <div
                            className="glass-panel p-4 mt-4 flex flex-col items-center"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                width: "max-content",
                            }}
                        >
                        <div ref={panelContentRef} style={{ textAlign: 'left' }}>
                                <h2 className="text-xl font-bold mt-4 panel-section-title">Informazioni su questo Testo</h2>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Titolo:</span> {teiContent.title}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Autore:</span> {teiContent.author}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Lingua:</span> {teiContent.language === 'grc' ? 'Greco Antico' : teiContent.language}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Periodo:</span> {teiContent.timePeriod}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Tipologia:</span> {teiContent.workType}
                                </p>
                                 <p className="mt-2 text-sm panel-item" >
                                      <span className="font-medium">Fonte:</span> {teiContent.source}
                                </p>
                                <p className="mt-2 text-sm panel-item" >
                                    <span className="font-medium">Fonte della Traduzione:</span> {teiContent.translationSource}
                                </p>
                                <p className="mt-2 text-sm panel-item">
                                    <span className="font-medium">Traduttore:</span> {teiContent.translator}
                                </p>
                         </div>
                                <button
                                    href={teiContent.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-panel p-2 mt-4 btn-style"
                                >
                                    Vai alla Fonte del Testo
                                </button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Omph;