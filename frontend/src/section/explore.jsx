import React, { useState, useEffect, forwardRef, useMemo, useCallback } from "react";
import "../style/App.css";

import axios from "axios";

//===============================================
// CONSTANTS
//===============================================
const TRANSITION_DURATION = 300; 
const MOBILE_BREAKPOINT = 768;


//===============================================
// DUMMY DATA (Used as initial state and reference)
//===============================================
// ❌ REMOVED: initialPlaceData (The component will start with an empty array)

const cardDataList = [
    // 💡 Added a 'category' key to map card IDs to specific categories if needed later. 
    // For now, we'll map the ID (1, 2, 3, 4) to the fetched data.
    { id: 1, title: "Pemandangan", category: "Alam", description: "Nikmati pemandangan indah di kota Palu dan sekitarnya...", details: "Pemandangan Palu meliputi Pantai Talise..." },
    { id: 2, title: "Hiburan", category: "Hiburan", description: "Temukan berbagai pusat hiburan dan rekreasi yang seru...", details: "Pilihan hiburan termasuk mall-mall besar..." },
    { id: 3, title: "Taman", category: "Taman", description: "Jelajahi taman-taman kota yang hijau dan asri...", details: "Taman GOR dan Taman Kota Palu menjadi pilihan utama..." },
    { id: 4, title: "Lainnya", category: "Lainnya", description: "Beragam destinasi unik lainnya yang patut dikunjungi...", details: "Jelajahi situs sejarah seperti makam raja-raja Palu..." },
];
//===============================================


//===============================================
// HELPER FUNCTIONS (No change)
//===============================================
const chunkArray = (arr, size) => {
    if (!arr) return [];
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
        chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
};
//===============================================


//===============================================
// MAIN COMPONENT
//===============================================
const ExploreSection = forwardRef(({ requestedCardId, setRequestedCardId }, ref) => {

    //=============================================
    // STATE VARIABLES
    //=============================================
    const [expandedCardId, setExpandedCardId] = useState(null); 
    const [isMobile, setIsMobile] = useState(() => 
        window.innerWidth <= MOBILE_BREAKPOINT
    );
    const [isVisible, setIsVisible] = useState(true); 
    const [lastCardYPosition, setLastCardYPosition] = useState(0);

    // 💡 CHANGED: Initialize placesData to an empty ARRAY, not an object.
    const [placesData, setPlacesData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    const cardData = useMemo(() => cardDataList, []);
    //=============================================

    //=============================================
    // EFFECT: HANDLE RESIZE 💻
    //=============================================
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    //=============================================

    //=============================================
    // DATA FETCHING 🌐
    //=============================================
    const fetchPlaces = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/places/');
            
            // 💡 STORE RAW ARRAY: Store the raw array of places.
            setPlacesData(response.data);
            
        } catch (error) {
            console.error('Error fetching places for explore section:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);
    //=============================================

    //=============================================
    // EFFECT: HANDLE MENU REQUESTED EXPANSION (No change)
    //=============================================
    useEffect(() => {
        if (requestedCardId !== null) {
            
            if (expandedCardId === null) {
                // Scenario 1: Closed -> Open
                setIsVisible(false);
                setTimeout(() => {
                    setExpandedCardId(requestedCardId);
                    setIsVisible(true);
                    setRequestedCardId(null); 
                }, TRANSITION_DURATION); 

            } else if (expandedCardId !== requestedCardId) {
                // Scenario 2: Open -> Switch Content
                setIsVisible(false);
                setTimeout(() => {
                    setExpandedCardId(requestedCardId);
                    setIsVisible(true);
                    setRequestedCardId(null);
                }, TRANSITION_DURATION / 2); 

            } else {
                // Case: Already open, clicking same item
                handleBackClick(); 
                setRequestedCardId(null);
            }
        }
    }, [requestedCardId, expandedCardId, setRequestedCardId]); 
    //=============================================
    
    
    //=============================================
    // HANDLERS: INTERNAL CARD NAVIGATION (No change)
    //=============================================
    
    const handleCardClick = (id, targetElement) => {
        if (targetElement) {
            setLastCardYPosition(targetElement.offsetTop);
        } else {
            setLastCardYPosition(window.scrollY);
        }
        
        setIsVisible(false); 

        setTimeout(() => {
            setExpandedCardId(id);
            
            if (ref.current) {
                ref.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            setIsVisible(true);
        }, TRANSITION_DURATION); 
    };

    const handleBackClick = () => {
        setIsVisible(false);
        
        setTimeout(() => {
            setExpandedCardId(null);
            
            ref.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            setIsVisible(true);
        }, TRANSITION_DURATION); 
    };
    //=============================================


    //=============================================
    // RENDER METHODS 🖼️
    //=============================================

    const renderExpandedView = () => {
        const expandedData = cardData.find((data) => data.id === expandedCardId);
        
        if (!expandedData) {
            return handleBackClick();
        }

        // 💡 NEW LOGIC: Filter the full placesData array based on the category name
        // We assume the place object has a 'category' field matching 'expandedData.category'
        const places = placesData.filter(place => 
            place.category === expandedData.category
        ) || [];
        
        const chunkedPlaces = chunkArray(places, 2); 

        return (
            <section 
                ref={ref} 
                id="expanded-section" 
                className={`expanded-detail-view ${isVisible ? 'transition-fade-in' : ''}`}
            >
                <div className="container">
                    
                    {/* Loading & Empty State */}
                    {isLoading && <p className="text-center py-8">Memuat tempat-tempat...</p>}
                    {!isLoading && places.length === 0 && <p className="text-center py-8">Tidak ada tempat ditemukan untuk kategori {expandedData.category}.</p>}

                    <div className="expanded-card">
                        <div className="expanded-image"></div>
                        <div className="expanded-content">
                            <h1>{expandedData.title.toUpperCase()}</h1>
                            
                            {/* Render Chunked Places */}
                            {!isLoading && chunkedPlaces.map((row, rowIndex) => (
                                <div key={rowIndex} className="explore-grid-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> 
                                    {row.map((place) => (
                                        <div key={place._id} className="explore-item-card">
                                            <div className="explore-item-image">
                                                <div
                                                    className="recom-img"
                                                    style={{
                                                        backgroundImage: `url(${place.photo_url ? `${place.photo_url}` : '/default-place.jpg'})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        height: '45vh',
                                                        borderRadius: '8px 8px 0 0'
                                                    }}>
                                                    <div className="explore-item-image-overlay">
                                                        <div className="extend-explore-item-content">
                                                            <h3>{place.name}</h3>
                                                            <p className="explore-item-category">{place.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div href="#" className="back-button">
                                                JELAJAH
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="expand-end-button">
                        <div href="#" className="back-button expanded-back-button" onClick={(e) => {
                            e.preventDefault();
                            handleBackClick();
                        }}>
                            Kembali
                        </div>
                        <div className="back-button expanded-back-button">
                            Lebih Lanjut
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    
    const renderExploreSection = () => {
        return(
            <section 
                ref={ref} 
                id="explore-section" 
                className={isVisible ? 'transition-fade-in' : ''}
            > 
                <div className="container">
                    <div className="main-text">
                        <h1>PLACE TO EXPLORE</h1> 
                        <p>Temukan tempat-tempat indah di Palu dan sekitarnya dengan SiWAKOPs.</p>
                    </div>

                    <div className="explore-container">
                        {cardData.map((data) => {
                            const isEven = data.id % 2 === 0; 
                            const reverseClass = isEven ? 'explore-item-reverse' : ''; 
                            
                            const cardClickHandler = isMobile 
                                ? (e) => handleCardClick(data.id, e.currentTarget) 
                                : undefined;

                            return (
                                <div 
                                    key={data.id} 
                                    className={`about-card explore-item ${reverseClass} ${!isMobile ? 'pc-cursor' : ''}`}
                                    onClick={cardClickHandler}
                                >
                                    <div className="about-image">
                                        <img src="/dum-img.jpg" alt={`Explore ${data.id}`} />
                                    </div>
                                    <div className="about-content">
                                        <h1>{data.title}</h1>
                                        <p>{data.description}</p>
                                        
                                        <a 
                                            className="about-cta explore-cta" 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation(); 
                                                handleCardClick(data.id, e.currentTarget.closest('.about-card'));
                                            }}
                                        >
                                            Lebih Lanjut →
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
    //=============================================
    
    // --- Main Render Logic ---
    
    if (expandedCardId !== null) {
        return renderExpandedView();
    }
    
    return renderExploreSection();
});

export default ExploreSection;