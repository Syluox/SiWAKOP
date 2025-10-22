import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Only need useNavigate
import "../App.css";
import "./recomend.css";
// import PlaceDetail from "../pages/PlaceDetail"; // Not needed here

function RecommendSection() {
    const [places, setPlaces] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // 1. Accept the ID as an argument
    const handleDetailClick = (placeId) => {
        // 2. Construct the final URL using template literals
        // If your route is /detail/:id, the URL should be /detail/12345
        navigate(`/detail/${placeId}`); 
    }

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch places from MongoDB
    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/places/rand');
                const data = response.data;
                console.log('Fetched recommended places:', data);
                // If on mobile, only take 4 places
                const selected = isMobile ? data.slice(0, 4) : data;
                setPlaces(selected);
                setError(null);
            } catch (error) {
                console.error('Error fetching places:', error);
                setError(error.response?.data?.message || 'Failed to load recommendations');
                if (error.response?.data?.error) {
                    console.error('Server error details:', error.response.data.error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [isMobile]); // Re-fetch when screen size changes

    if (loading) {
        return (
            <section id="recommend">
                <div className="container">
                    <div className="loading-message">Loading recommended places...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="recommend">
                <div className="container">
                    <div className="error-message">{error}</div>
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
                                    {place.description.length > 100 
                                        ? place.description.substring(0, 100) + '...' 
                                        : place.description}
                                </p>
                                <div className="recom-footer">
                                    <span className="recom-location">{place.kecamatan}</span>
                                    {/* 3. Call the function with the specific place ID */}
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