import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
// Import the necessary hook from react-leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; 
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './PlaceDetail.css';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});


// --- NEW COMPONENT FOR ROUTING ---
const RoutingMachine = ({ userLocation, place }) => {
    // 1. Get the Leaflet map instance using useMap()
    const map = useMap(); 

    // 2. Use useEffect to run Leaflet side effects once
    useEffect(() => {
        if (!map || !userLocation || !place) return;

        // 3. Initialize the routing control
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation[0], userLocation[1]),
                L.latLng(place.latitude, place.longitude)
            ],
            // You can customize the router and appearance here
            routeWhileDragging: true,
            showAlternatives: false,
            // You can remove the default itinerary panel if you want
            // show: false, 
            // itineraryToogle: false, 
        }).addTo(map);

        // Optional: Clean up the control when the component unmounts
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, userLocation, place]); // Re-run if location or place changes

    return null; // This component doesn't render any visible DOM elements
};
// ------------------------------------


const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch place details
    axios.get(`http://localhost:5000/api/places/${id}`)
      .then(res => setPlace(res.data))
      .catch(err => setError('Error fetching place details'));

    // Get user location for directions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        err => setError('Unable to get location')
      );
    } else {
      setError('Geolocation not supported');
    }
  }, [id]);

  // Calculate distance (Haversine formula) - No change needed
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Estimate travel time - No change needed
  const estimateTravelTime = (dist) => {
    const hours = dist / 50; // Assume average speed
    return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
  };

  useEffect(() => {
    if (place && userLocation) {
      const dist = calculateDistance(userLocation[0], userLocation[1], place.latitude, place.longitude);
      setDistance(dist.toFixed(2));
      setTravelTime(estimateTravelTime(dist));
    }
  }, [place, userLocation]);

  // Parse operating hours - No change needed
  const getClosingTime = () => {
    const { type, end } = place.operating_hours;
    if (type === '24_hour') return 'Open 24/7';
    return `Closes at ${end}`;
  };

  if (error) return <p>{error}</p>;
  if (!place) return <p>Loading...</p>;

  // Ensure place has lat/lng data before rendering the map
  if (!place.latitude || !place.longitude) {
    return <p>Place data is incomplete (missing coordinates).</p>
  }

  return (
    <div className="place-detail">
      <h1>{place.name}</h1>
      {/* Check if photo_url is not null/empty to avoid src error */}
      {place.photo_url && <img src={place.photo_url} alt={place.name} className="place-image" />}
      
      <p className="description">{place.description}</p>
      <p>Category: **{place.category}**</p>
      <p>Address: {place.address}, {place.kecamatan}</p>
      <p>Facilities: **{place.facilities.join(', ')}**</p>
      <p>Operating Hours: **{getClosingTime()}**</p>
      <p>Price:</p>
      <ul>
        <li>Entry Fee: **${place.price.entry_fee}**</li>
        <li>Parking Bike: **${place.price.parking_bike}**</li>
        <li>Parking Car: **${place.price.parking_car}**</li>
        <li>Note: {place.price.note}</li>
      </ul>

      {/* --- UPDATED MAP SECTION --- */}
      <section className="map-section">
        <h2>Map & Directions</h2>
        {/* Render MapContainer only if place coordinates exist */}
        <MapContainer 
            center={[place.latitude, place.longitude]} 
            zoom={13} 
            style={{ height: '400px' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={[place.latitude, place.longitude]}>
                <Popup>{place.name}</Popup>
            </Marker>
            
            {/* 4. Conditionally render the new RoutingMachine component */}
            {userLocation && (
                <RoutingMachine userLocation={userLocation} place={place} />
            )}
        </MapContainer>
        {distance && <p>Distance: **{distance} km** | Estimated Time: **{travelTime}**</p>}
      </section>
      {/* --- END UPDATED MAP SECTION --- */}

      <section className="reviews-section">
        <h2>Reviews</h2>
        {place.reviews.map((r, i) => (
          <div key={i} className="review">
            <p>Rating: **{r.rating} / 5**</p>
            <p>{r.comment}</p>
            <p>By: {r.user.username} on {new Date(r.date).toLocaleDateString()}</p>
          </div>
        ))}
        {place.reviews.length === 0 && <p>No reviews yet.</p>}
      </section>

      <section className="documentation-section">
        <h2>Documentation</h2>
        <p>{place.document || 'No documentation available'}</p>
      </section>

      <Link to="/" className="back-btn">Back to Recommendations</Link>
    </div>
  );
};

export default PlaceDetail;