import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complains, setComplains] = useState([]);
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: '',
    imageUrl: '',
    coordinates: [0, 0],
    explanation: '',
    openHours: ''
  });
  const [newDocumentation, setNewDocumentation] = useState('');
  const [selectedPlaceIdForDoc, setSelectedPlaceIdForDoc] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [selectedPlaceIdForReview, setSelectedPlaceIdForReview] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [mapClickPosition, setMapClickPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Fetch users
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
    // Fetch places
    axios.get('http://localhost:5000/api/places')
      .then(res => setPlaces(res.data))
      .catch(err => console.error('Error fetching places:', err));
    // Fetch requested places (assume /admin/requests endpoint)
    axios.get('http://localhost:5000/api/admin/requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Error fetching requests:', err));
    // Fetch complains (from previous /admin/complains)
    axios.get('http://localhost:5000/api/admin/complains')
      .then(res => setComplains(res.data))
      .catch(err => console.error('Error fetching complains:', err));
  }, []);

  const deleteUser = (userId) => {
    axios.delete(`/admin/users/${userId}`)
      .then(() => {
        alert('User deleted');
        setUsers(users.filter(u => u._id !== userId));
      })
      .catch(err => console.error('Error deleting user:', err));
  };

  const blockUser = (userId) => {
    axios.put(`/admin/users/${userId}/block`)
      .then(() => {
        alert('User blocked');
        setUsers(users.map(u => u._id === userId ? { ...u, blocked: true } : u));
      })
      .catch(err => console.error('Error blocking user:', err));
  };

  const addPlace = () => {
    axios.post('http://localhost:5000/api/admin/places', newPlace)
      .then(res => {
        alert('Place added');
        setPlaces([...places, res.data]);
        setNewPlace({ name: '', category: '', imageUrl: '', coordinates: [0, 0], explanation: '', openHours: '' });
        setShowMap(false);
      })
      .catch(err => console.error('Error adding place:', err));
  };

  const addDocumentation = () => {
    axios.put(`/places/${selectedPlaceIdForDoc}/documentation`, { document: newDocumentation })
      .then(() => {
        alert('Documentation added');
        setNewDocumentation('');
        setSelectedPlaceIdForDoc(null);
      })
      .catch(err => console.error('Error adding documentation:', err));
  };

  const addReview = () => {
    axios.post(`/places/${selectedPlaceIdForReview}/review`, newReview)
      .then(() => {
        alert('Review added');
        setNewReview({ rating: 0, comment: '' });
        setSelectedPlaceIdForReview(null);
      })
      .catch(err => console.error('Error adding review:', err));
  };

  const deleteReview = () => {
    axios.delete(`/places/${selectedPlaceIdForReview}/review/${selectedReviewId}`)
      .then(() => {
        alert('Review deleted');
        setSelectedReviewId(null);
      })
      .catch(err => console.error('Error deleting review:', err));
  };

  const approveRequest = (requestId) => {
    axios.post(`/admin/requests/${requestId}/approve`)
      .then(() => {
        alert('Request approved');
        setRequests(requests.filter(r => r._id !== requestId));
      })
      .catch(err => console.error('Error approving request:', err));
  };

  // Map click handler for adding point
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setNewPlace({ ...newPlace, coordinates: [e.latlng.lng, e.latlng.lat] });
        setMapClickPosition(e.latlng);
      }
    });
    return null;
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section className="users-section">
        <h2>Manage Users</h2>
        <ul className="users-list">
          {users.map(u => (
            <li key={u._id} className="user-item">
              <span>{u.username} ({u.email})</span>
              <button onClick={() => deleteUser(u._id)}>Delete</button>
              <button onClick={() => blockUser(u._id)}>Block</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="add-place-section">
        <h2>Add Place</h2>
        <input placeholder="Name" value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} />
        <input placeholder="Category" value={newPlace.category} onChange={e => setNewPlace({...newPlace, category: e.target.value})} />
        <input placeholder="Image URL" value={newPlace.imageUrl} onChange={e => setNewPlace({...newPlace, imageUrl: e.target.value})} />
        <input placeholder="Explanation" value={newPlace.explanation} onChange={e => setNewPlace({...newPlace, explanation: e.target.value})} />
        <input placeholder="Open Hours" value={newPlace.openHours} onChange={e => setNewPlace({...newPlace, openHours: e.target.value})} />
        <button onClick={() => setShowMap(!showMap)}>Toggle Map to Add Point</button>
        {showMap && (
          <MapContainer center={[-0.9031, 119.8726]} zoom={12} style={{ height: '300px', marginBottom: '10px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler />
            {mapClickPosition && <Marker position={mapClickPosition} />}
          </MapContainer>
        )}
        <p>Coordinates: {newPlace.coordinates.join(', ')}</p>
        <button onClick={addPlace}>Add Place</button>
      </section>

      <section className="documentation-section">
        <h2>Add Documentation to Place</h2>
        <select onChange={e => setSelectedPlaceIdForDoc(e.target.value)}>
          <option value="">Select Place</option>
          {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <textarea placeholder="Documentation" value={newDocumentation} onChange={e => setNewDocumentation(e.target.value)} />
        <button onClick={addDocumentation}>Add</button>
      </section>

      <section className="review-section">
        <h2>Add Review to Place</h2>
        <select onChange={e => setSelectedPlaceIdForReview(e.target.value)}>
          <option value="">Select Place</option>
          {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <input type="number" min={1} max={5} placeholder="Rating (1-5)" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} />
        <textarea placeholder="Comment" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} />
        <button onClick={addReview}>Add Review</button>
      </section>

      <section className="delete-review-section">
        <h2>Delete Review</h2>
        <select onChange={e => setSelectedPlaceIdForReview(e.target.value)}>
          <option value="">Select Place</option>
          {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        {selectedPlaceIdForReview && (
          <select onChange={e => setSelectedReviewId(e.target.value)}>
            <option value="">Select Review</option>
            {places.find(p => p._id === selectedPlaceIdForReview)?.reviews.map(r => (
              <option key={r._id} value={r._id}>Rating: {r.rating}</option>
            ))}
          </select>
        )}
        <button onClick={deleteReview}>Delete Selected Review</button>
      </section>

      <section className="requests-section">
        <h2>View Requested Places</h2>
        <ul>
          {requests.map(r => (
            <li key={r._id}>
              {r.name} requested by {r.user.username}
              <button onClick={() => approveRequest(r._id)}>Approve</button>
              <button onClick={() => deleteRequest(r._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="complains-section">
        <h2>View Complains</h2>
        <ul>
          {complains.map(c => (
            <li key={c._id}>
              {c.place.name}: {c.complain} by {c.user.username}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;