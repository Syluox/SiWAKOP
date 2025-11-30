import React, { useState, useEffect, forwardRef, useMemo } from "react";
import "../style/App.css";

//===============================================
// CONSTANTS
//===============================================
const TRANSITION_DURATION = 300; 
const MOBILE_BREAKPOINT = 768;


//===============================================
// DUMMY DATA FOR PLACES
//===============================================
const placeData = {
    // I assumed you have data for all card IDs 1, 2, 3, and 4
    1: [
        { _id: 101, name: "Pantai Talise", category: "Pantai", description: "Pemandangan teluk Palu yang ikonik, sempurna untuk sunset.", photo_url: "/dum-img.jpg" },
        { _id: 102, name: "Pegunungan Gawalise", category: "Gunung", description: "Tujuan hiking populer dengan pemandangan kota dari ketinggian.", photo_url: "/dum-img.jpg" },
        { _id: 201, name: "Palu Grand Mall", category: "Pusat Perbelanjaan", description: "Mall terbesar di kota Palu dengan bioskop dan restoran.", photo_url: "/dum-img.jpg" },
        { _id: 202, name: "Waterboom Palu", category: "Rekreasi Air", description: "Taman air keluarga yang cocok untuk bersantai.", photo_url: "/dum-img.jpg" }
    ],
    2: [{ _id: 201, name: "Palu Grand Mall", category: "Pusat Perbelanjaan", description: "Mall terbesar di kota Palu dengan bioskop dan restoran.", photo_url: "/dum-img.jpg" }],
    3: [{ _id: 301, name: "Taman GOR", category: "Taman Kota", description: "Taman populer untuk olahraga dan rekreasi.", photo_url: "/dum-img.jpg" }],
    4: [{ _id: 401, name: "Makam Raja", category: "Situs Sejarah", description: "Situs bersejarah makam raja-raja Palu.", photo_url: "/dum-img.jpg" }]
};

const cardDataList = [
    { id: 1, title: "Pemandangan", description: "Nikmati pemandangan indah di kota Palu dan sekitarnya...", details: "Pemandangan Palu meliputi Pantai Talise..." },
    { id: 2, title: "Hiburan", description: "Temukan berbagai pusat hiburan dan rekreasi yang seru...", details: "Pilihan hiburan termasuk mall-mall besar..." },
    { id: 3, title: "Taman", description: "Jelajahi taman-taman kota yang hijau dan asri...", details: "Taman GOR dan Taman Kota Palu menjadi pilihan utama..." },
    { id: 4, title: "Lainnya", description: "Beragam destinasi unik lainnya yang patut dikunjungi...", details: "Jelajahi situs sejarah seperti makam raja-raja Palu..." },
];
//===============================================


//===============================================
// HELPER FUNCTIONS
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

    const cardData = useMemo(() => cardDataList, []);
    //=============================================

    // ... (EFFECT: HANDLE RESIZE remains the same) ...

    //=============================================
    // EFFECT: HANDLE MENU REQUESTED EXPANSION 💡
    //=============================================
    useEffect(() => {
        if (requestedCardId !== null) {
            
            // Scenario 1: Section is currently closed (expandedCardId === null)
            if (expandedCardId === null) {
                // 1. Initiate fade out of the main grid
                setIsVisible(false);
                
                // 2. Wait for the fade-out, then swap component and fade in
                setTimeout(() => {
                    setExpandedCardId(requestedCardId);
                    setIsVisible(true);
                    setRequestedCardId(null); 
                    // Scroll action was handled by App.js
                }, TRANSITION_DURATION); 

            // 🌟 Scenario 2: Section is ALREADY OPEN (expandedCardId !== null)
            } else if (expandedCardId !== requestedCardId) {
                // Skip the fade-out/scroll sequence, just change content immediately
                
                // 1. Initiate quick fade out of expanded content
                setIsVisible(false);

                // 2. Wait a short time to show the transition effect
                setTimeout(() => {
                    // 3. Immediately change the expanded content ID
                    setExpandedCardId(requestedCardId);
                    
                    // 4. Initiate fade in of the new content
                    setIsVisible(true);
                    setRequestedCardId(null);
                    
                    // The view is already scrolled to the top, so no need to scroll again
                }, TRANSITION_DURATION / 2); // Use half duration for faster switching
            } else {
                // Case: requestedCardId === expandedCardId (user clicked the already active item)
                handleBackClick(); // Close the expanded view
                setRequestedCardId(null);
            }
        }
    }, [requestedCardId, expandedCardId, setRequestedCardId]); 
    //=============================================
    
    
    //=============================================
    // HANDLERS: INTERNAL CARD NAVIGATION
    //=============================================
    
    const handleCardClick = (id, targetElement) => {
        // ... (Logic remains the same: store position, fade out, set expandedId, scroll to top, fade in) ...
        
        // 1. Store the scroll position for returning later
        if (targetElement) {
            setLastCardYPosition(targetElement.offsetTop);
        } else {
            setLastCardYPosition(window.scrollY);
        }
        
        // 2. Initiate fade out
        setIsVisible(false); 

        // 3. Wait for the transition
        setTimeout(() => {
            // Change state to render expanded view
            setExpandedCardId(id);
            
            // Scroll the entire section into view
            if (ref.current) {
                ref.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // 4. Initiate fade in
            setIsVisible(true);
        }, TRANSITION_DURATION); 
    };

    const handleBackClick = () => {
        // ... (Logic remains the same: fade out, set expandedId=null, scroll back, fade in) ...
        
        // 1. Initiate fade out
        setIsVisible(false);
        
        // 2. Wait for the transition
        setTimeout(() => {
            // Change state back to render explore section
            setExpandedCardId(null);
            
            // Scroll back to the original card's position
            ref.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
           

            // 3. Initiate fade in
            setIsVisible(true);
        }, TRANSITION_DURATION); 
    };
    //=============================================


    //=============================================
    // RENDER METHODS (No structural change needed here)
    //=============================================

    const renderExpandedView = () => {
        const expandedData = cardData.find((data) => data.id === expandedCardId);
        
        if (!expandedData) {
            // If data is missing for the expanded ID, go back
            return handleBackClick();
        }

        const places = placeData[expandedCardId] || []; 
        const chunkedPlaces = chunkArray(places, 2); 

        return (
            <section 
                ref={ref} 
                id="expanded-section" 
                className={`expanded-detail-view ${isVisible ? 'transition-fade-in' : ''}`}
            >
                <div className="container">
                    {/* EXPANDED CONTENT (Rendering logic remains the same) */}
                    <div className="expanded-card">
                        <div className="expanded-image"></div>
                        <div className="expanded-content">
                            <h1 >{expandedData.title.toUpperCase()}</h1>
                            {chunkedPlaces.map((row, rowIndex) => (
                                <div key={rowIndex} className="explore-grid-row"> 
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
        // ... (Logic remains the same) ...
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