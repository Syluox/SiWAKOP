import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './UserPage.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // For near map
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePic, setNewProfilePic] = useState('');
  const [newPlanPlaceId, setNewPlanPlaceId] = useState('');
  const [newPlanDate, setNewPlanDate] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [complainText, setComplainText] = useState('');
  const [selectedComplainPlaceId, setSelectedComplainPlaceId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('/users/me')
      .then(res => {
        setUser(res.data);
        setPlans(res.data.plans || []);
        setHistory(res.data.history || []);
        setNewUsername(res.data.username);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        window.location.href = '/';
      });
    axios.get('/api/places/')
      .then(res => setPlaces(res.data))
      .catch(err => console.error('Error fetching places:', err));

    // Get user location for near map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        // Fetch nearby places (assume backend /places/near?lat=lng&radius=10km)
        axios.get(`/api/places/near?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=10`)
          .then(res => setNearbyPlaces(res.data))
          .catch(err => console.error('Error fetching nearby:', err));
      }, err => console.error('Location error:', err));
    }
  }, []);

  const updateProfile = () => {
    axios.put('/users/me', { username: newUsername, profilePic: newProfilePic })
      .then(() => {
        alert('Profile updated');
        setUser({ ...user, username: newUsername });
        setShowEditProfile(false);
      })
      .catch(err => console.error('Error updating profile:', err));
  };

  const addPlan = () => {
    axios.post('/users/plan', { placeId: newPlanPlaceId, date: newPlanDate })
      .then(() => {
        alert('Plan added');
        setPlans([...plans, { placeId: newPlanPlaceId, date: newPlanDate, status: 'planned' }]);
        setShowAddPlan(false);
      })
      .catch(err => console.error('Error adding plan:', err));
  };

  const markPlanDone = (planId) => {
    axios.put(`/users/plan/${planId}`, { status: 'done' })
      .then(() => {
        alert('Plan marked as done');
        setPlans(plans.map(p => p._id === planId ? { ...p, status: 'done' } : p));
      })
      .catch(err => console.error('Error marking done:', err));
  };

  const submitReview = () => {
    if (!selectedPlanId || reviewRating === 0) {
      alert('Select plan and rating');
      return;
    }
    axios.post(`/places/${selectedPlanId}/rate`, { rating: reviewRating, comment: reviewComment })
      .then(() => {
        alert('Review submitted');
        setReviewRating(0);
        setReviewComment('');
        setSelectedPlanId(null);
      })
      .catch(err => console.error('Error submitting review:', err));
  };

  const submitComplain = () => {
    if (!selectedComplainPlaceId || !complainText.trim()) {
      alert('Select place and enter complain');
      return;
    }
    axios.post(`/places/${selectedComplainPlaceId}/complain`, { complain: complainText })
      .then(() => {
        alert('Complain submitted');
        setComplainText('');
        setSelectedComplainPlaceId(null);
      })
      .catch(err => console.error('Error submitting complain:', err));
  };

  const addHistory = (placeId) => {
    axios.post('/users/history', { placeId })
      .then(() => {
        alert('Added to history');
        setHistory([...history, { placeId, date: new Date() }]);
      })
      .catch(err => console.error('Error adding history:', err));
  };

  const requestPlace = (name) => {
    alert(`New place requested: ${name}`);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-dashboard">
      <header className='user-header'>
        <img className='profile-picture' src={user.profilePic || '/card1.jpg'} alt="Profile" />
        <div className='user-head-text'>
          <h1>{user.username}</h1>
          <p>Welcome back!</p>
        </div>
        <div className='edit-profile-btn'>
          <button onClick={() => setShowEditProfile(true)}>&gt;</button>
        </div>
      </header>

      <section className="user-info">
        <div className='activity-container'>
          <Link to="/user/activities">
            <h2>My Activities ({history.length})</h2>
          </Link>
        </div>
        <div className='favorites-container'>
          <Link to="/user/favorites">
            <h2>My Favorites ({plans.length})</h2>
          </Link>
        </div>
      </section>

      <section className="planning-section">
        <h2>My Plans</h2>
        <ul>
          {plans.map((plan, i) => {
            const place = places.find(p => p._id === plan.placeId);
            return place ? (
              <li key={i} className="plan-item">
                <img src={place.imageUrl} alt={place.name} className="plan-image" />
                <div>
                  <h3>{place.name}</h3>
                  <p>{plan.category} - {new Date(plan.date).toLocaleString()}</p>
                  <p>Status: {plan.status}</p>
                  <button onClick={() => markPlanDone(plan._id)}>Mark as Done</button>
                  <button onClick={() => setSelectedPlanId(place._id)}>Review</button>
                </div>
              </li>
            ) : null;
          })}
        </ul>
        <button onClick={() => setShowAddPlan(true)}>Add Plan</button>
      </section>

      <section className="review-section" style={{ display: selectedPlanId ? 'block' : 'none' }}>
        <h2>Review Plan</h2>
        <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
          <option value={0}>Rating</option>
          {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
        </select>
        <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Comment" />
        <button onClick={submitReview}>Submit Review</button>
        <button onClick={() => setSelectedPlanId(null)}>Cancel</button>
      </section>

      <section className="near-map-section">
        <h2>Nearby Places</h2>
        {userLocation ? (
          <MapContainer center={userLocation} zoom={13} style={{ height: '300px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {nearbyPlaces.map(place => place.coordinates && (
              <Marker key={place._id} position={[place.coordinates[1], place.coordinates[0]]}>
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : <p>Enable location to see nearby places.</p>}
      </section>

      <section className="history-section">
        <h2>My History</h2>
        <ul>
          {history.map((h, i) => {
            const place = places.find(p => p._id === h.placeId);
            return place ? (
              <li key={i}>
                {place.name} on {new Date(h.date).toLocaleString()}
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <section className="complain-section">
        <h2>Complain</h2>
        <select onChange={e => setSelectedComplainPlaceId(e.target.value)}>
          <option value="">Select Place</option>
          {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <textarea value={complainText} onChange={e => setComplainText(e.target.value)} placeholder="Complain" />
        <button onClick={submitComplain}>Submit</button>
      </section>

      <section className="request-section">
        <h2>Request New Place</h2>
        <input type="text" placeholder="Place name" />
        <button>Request</button>
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal">
          <h2>Edit Profile</h2>
          <input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="New Username" />
          <input value={newProfilePic} onChange={e => setNewProfilePic(e.target.value)} placeholder="Profile Pic URL" />
          <button onClick={updateProfile}>Save</button>
          <button onClick={() => setShowEditProfile(false)}>Cancel</button>
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddPlan && (
        <div className="modal">
          <h2>Add Plan</h2>
          <select onChange={e => setNewPlanPlaceId(e.target.value)}>
            <option value="">Select Place</option>
            {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="datetime-local" value={newPlanDate} onChange={e => setNewPlanDate(e.target.value)} />
          <button onClick={addPlan}>Add</button>
          <button onClick={() => setShowAddPlan(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;