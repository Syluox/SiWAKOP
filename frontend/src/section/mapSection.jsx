import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './mapSection.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function MapSection() {
    const [places, setPlaces] = useState([]);

    const handleViewDetails = (placeId) => {
        if (placeId) {
            navigate(`/place/${placeId}`);
        }
    };

    // Fetch places from MongoDB
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/places');
                const places = response.data;
                // Validate coordinates
                console.log('Fetched places:', places);
                
                setPlaces(places);
            } catch (error) {
                console.error('Error fetching places:', error);
            }
        };
        fetchPlaces();
    }, []);

    return (
        <section id="map-section" className="map-section">
            <div className="container">
                <div className="main-text">
                    <h1>LOKASI WISATA</h1>
                    <p>Jelajahi lokasi-lokasi menarik di Palu melalui peta interaktif.</p>
                </div>
                <div className="map-container">
                    <MapContainer
                        center={[-0.9031, 119.8726]} // [latitude, longitude] for Palu
                        zoom={12}
                        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {places.map(place => (
                            place.name && (
                                <Marker
                                    key={place._id}
                                    position={[place.latitude, place.longitude]}
                                >
                                    <Popup>
                                        <div className="popup-content">
                                            <img src={place.photo_url} alt={place.name} style={{ width: '100%', borderRadius: '8px' }} />
                                            <h3>{place.name}</h3>
                                            <p>{place.description}</p>
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => handleViewDetails(place._id)}
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>
        </section>
    );
}

export default MapSection;