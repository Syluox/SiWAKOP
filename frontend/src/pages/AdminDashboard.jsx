import { useEffect, useState } from 'react';
import axios from 'axios';

// --- Styling Object for a Modern Look ---
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  section: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  button: {
    padding: '12px 20px',
    margin: '10px 5px 10px 0',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  select: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  coordinatesInfo: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e9f7ff',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff',
  }
};

const AdminDashboard = () => {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: '',
    imageUrl: '',
    // Now simply using text inputs for coordinates
    coordinates: [0, 0], 
    explanation: '',
    openHours: ''
  });
  const [selectedPlaceIdToDelete, setSelectedPlaceIdToDelete] = useState('');

  // --- API Functions ---

  const fetchPlaces = async () => {
    try {
      // Assuming token setup is handled elsewhere or is not strictly necessary for GET /places
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get('http://localhost:5000/api/places');
      setPlaces(response.data);
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const addPlace = async () => {
    if (!newPlace.name || newPlace.coordinates[0] === 0 || newPlace.coordinates[1] === 0) {
      alert('Please fill in the name, longitude, and latitude.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/places', newPlace);
      alert('Place added successfully!');
      
      setPlaces([...places, res.data]); 
      setNewPlace({ name: '', category: '', imageUrl: '', coordinates: [0, 0], explanation: '', openHours: '' });
    } catch (err) {
      console.error('Error adding place:', err);
      alert('Failed to add place. Check console for details.');
    }
  };

  const deletePlace = async () => {
    if (!selectedPlaceIdToDelete) {
      alert('Please select a place to delete.');
      return;
    }

    try {
      // Assuming the DELETE endpoint is correct
      await axios.delete(`http://localhost:5000/api/admin/places/${selectedPlaceIdToDelete}`);
      alert('Place deleted successfully!');
      
      setPlaces(places.filter(p => p._id !== selectedPlaceIdToDelete));
      setSelectedPlaceIdToDelete('');
    } catch (err) {
      console.error('Error deleting place:', err);
      alert('Failed to delete place. Check console for details.');
    }
  };

  // --- Effect Hook ---

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    fetchPlaces();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🗺️ Admin Place Management</h1>

      {/* --- Add Place Section --- */}
      <section style={styles.section}>
        <h2>➕ Add New Place</h2>
        <input 
          style={styles.input}
          placeholder="Place Name" 
          value={newPlace.name} 
          onChange={e => setNewPlace({...newPlace, name: e.target.value})} 
        />
        <input 
          style={styles.input}
          placeholder="Category (e.g., Park, Museum)" 
          value={newPlace.category} 
          onChange={e => setNewPlace({...newPlace, category: e.target.value})} 
        />
        <input 
          style={styles.input}
          placeholder="Image URL" 
          value={newPlace.imageUrl} 
          onChange={e => setNewPlace({...newPlace, imageUrl: e.target.value})} 
        />
        <textarea 
          style={{...styles.input, height: '80px'}}
          placeholder="Explanation/Description" 
          value={newPlace.explanation} 
          onChange={e => setNewPlace({...newPlace, explanation: e.target.value})} 
        />
        <input 
          style={styles.input}
          placeholder="Open Hours (e.g., 9:00 - 17:00)" 
          value={newPlace.openHours} 
          onChange={e => setNewPlace({...newPlace, openHours: e.target.value})} 
        />
        
        {/* Coordinates Inputs (Manual Entry) */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            style={styles.input}
            type="number" 
            step="any"
            placeholder="Longitude (e.g., 119.8726)" 
            value={newPlace.coordinates[0]} 
            onChange={e => setNewPlace({...newPlace, coordinates: [Number(e.target.value), newPlace.coordinates[1]]})} 
          />
          <input 
            style={styles.input}
            type="number" 
            step="any"
            placeholder="Latitude (e.g., -0.9031)" 
            value={newPlace.coordinates[1]} 
            onChange={e => setNewPlace({...newPlace, coordinates: [newPlace.coordinates[0], Number(e.target.value)]})} 
          />
        </div>

        <p style={styles.coordinatesInfo}>
          Current Coordinates (Lng, Lat): **{newPlace.coordinates[0]}, {newPlace.coordinates[1]}**
        </p>
        
        <button 
          style={{...styles.button, ...styles.primaryButton}} 
          onClick={addPlace} 
          disabled={!newPlace.name || newPlace.coordinates[0] === 0}
        >
          ✅ Submit New Place
        </button>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

      {/* --- Delete Place Section --- */}
      <section style={styles.section}>
        <h2>🗑️ Delete Existing Place</h2>
        <select 
          style={styles.select}
          onChange={e => setSelectedPlaceIdToDelete(e.target.value)} 
          value={selectedPlaceIdToDelete}
        >
          <option value="">-- Select Place to Delete ({places.length} available) --</option>
          {places.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (ID: {p._id})
            </option>
          ))}
        </select>
        <button 
          style={{...styles.button, ...styles.dangerButton}} 
          onClick={deletePlace} 
          disabled={!selectedPlaceIdToDelete}
        >
          ❌ Delete Selected Place
        </button>
      </section>
    </div>
  );
};

export default AdminDashboard;