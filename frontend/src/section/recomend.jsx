import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../style/App.css";
import "./recomend.css";
import "../style/Media_768.css";

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    // Create a copy of the array to avoid modifying the original state directly
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};


function RecommendSection() {
    // State to hold the final places to display (4 or 8)
    const [places, setPlaces] = useState([]); 
    // State to hold the FULL list of fetched data
    const [fullData, setFullData] = useState([]); 

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleDetailClick = (placeId) => {
        navigate(`/detail/${placeId}`); 
    }

    // --- EFFECT 1: Handle window resize ---
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- EFFECT 2: Fetch ALL places (Runs only once on mount) ---
    useEffect(() => {
        const fetchAllPlaces = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/places/');
                const data = response.data;
                
                // Store the full list of places
                setFullData(data); 
                setError(null);
            } catch (error) {
                console.error('Error fetching places:', error);
                setError(error.response?.data?.message || 'Failed to load recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchAllPlaces();
    }, []); // Empty dependency array: runs once

    // --- EFFECT 3: Select 4 or 8 random places based on screen size (Runs on fullData or isMobile change) ---
    useEffect(() => {
        if (fullData.length > 0) {
            
            // 1. Shuffle the full data to ensure randomness
            const shuffled = shuffleArray(fullData);
            
            // 2. Determine the maximum display limit (8)
            const maxToSelect = 8;
            
            // 3. Select the first 8 (or less if fullData is small)
            const initialSelection = shuffled.slice(0, maxToSelect);

            // 4. Apply the mobile limit (4) to the selected subset (8)
            const finalDisplay = isMobile ? initialSelection.slice(0, 4) : initialSelection;
            
            setPlaces(finalDisplay);
        }
    }, [fullData, isMobile]); // Re-run when fetched data arrives OR when screen size changes
    
    // --- Render Logic ---

    if (loading) {
        return (
            <section id="recommend">
                <div className="container">
                    <div className="loading-message">Memuat tempat rekomendasi...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="recommend">
                <div className="container">
                    <div className="error-message">Terjadi kesalahan: {error}</div>
                </div>
            </section>
        );
    }

    // Display message if no places are found after loading
    if (places.length === 0 && !loading) {
        return (
            <section id="recommend">
                <div className="container">
                    <div className="error-message">Tidak ada rekomendasi tempat yang ditemukan.</div>
                </div>
            </section>
        );
    }


    return (
        <section id="recommend">
            <div className="container">
                <div className="main-text">
                    <h1>RECOMMENDED PLACES</h1>
                    <p>Berikut rekomendasi terbaik untuk Anda kunjungi saat di Palu.</p>
                </div>
                <div className="recom-grid">
                    {places.map((place) => (
                        <div key={place._id} className="recom-card">
                            <div 
                                className="recom-img" 
                                style={{
                                    backgroundImage: `url(${place.photo_url ? `${place.photo_url}` : '/default-place.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '200px',
                                    borderRadius: '8px 8px 0 0'
                                }}
                            ></div>
                            <div className="recom-content">
                                <h3>{place.name}</h3>
                                <p className="recom-category">{place.category}</p>
                                <p className="recom-description">
                                    {place.description && place.description.length > 100 
                                        ? place.description.substring(0, 100) + '...' 
                                        : place.description}
                                </p>
                                <div className="recom-footer">
                                    <span className="recom-location">{place.kecamatan}</span>
                                    <button 
                                        className="about-cta explore-cta" 
                                        onClick={() => handleDetailClick(place._id)}
                                    >
                                        Learn More →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RecommendSection;