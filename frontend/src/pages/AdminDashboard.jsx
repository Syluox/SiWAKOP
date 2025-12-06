import { useEffect, useState } from 'react';
import axios from 'axios';

// --- Styling Object for a Modern Look with Appealing Colors ---
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f7f6', // Light gray background
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#34495e', // Dark, appealing text color
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50', // Darker header color
    marginBottom: '35px',
    borderBottom: '3px solid #bdc3c7',
    paddingBottom: '15px',
    fontSize: '28px',
  },
  section: {
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    boxSizing: 'border-box',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px 20px',
    margin: '10px 5px 10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s, transform 0.1s',
    minWidth: '150px',
  },
  primaryButton: {
    backgroundColor: '#1abc9c', // Teal/Emerald Green
    color: 'white',
  },
  dangerButton: {
    backgroundColor: '#e74c3c', // Alizarin Red
    color: 'white',
  },
  successButton: { 
    backgroundColor: '#3498db', // Peter River Blue
    color: 'white',
    marginLeft: '10px',
  },
  select: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    boxSizing: 'border-box',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  coordinatesInfo: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    borderLeft: '4px solid #1abc9c',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '80px'
  },
  facilityList: {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0',
  },
  facilityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    marginBottom: '8px',
    color: '#34495e',
  },
  removeButton: {
    marginLeft: '10px',
    backgroundColor: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '14px',
  }
};

const AdminDashboard = () => {
  const [places, setPlaces] = useState([]);
  const [newFacilityName, setNewFacilityName] = useState('');
  
  // State for the new place form
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: '',
    photo_url: '', 
    latitude: 0,   
    longitude: 0,  
    description: '', 
    address: '',
    kecamatan: '',
    
    // Price fields
    price_entry_fee: 0,
    price_parking_bike: 0,
    price_parking_car: 0,
    price_note: '',

    // Operating Hours type and custom JSON string
    operating_hours_type: '24_hour', 
    operating_hours_custom: '', 
    
    // Facilities is a dynamic array of strings
    facilities: [], 
  });

  const [selectedPlaceIdToDelete, setSelectedPlaceIdToDelete] = useState('');

  // --- Utility/Helper Functions ---

  const fetchPlaces = async () => {
    try {
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

  /**
   * Facility handling logic.
   */
  const handleAddFacility = () => {
    const trimmedName = newFacilityName.trim();
    if (trimmedName && !newPlace.facilities.includes(trimmedName)) {
      setNewPlace(prev => ({
        ...prev,
        facilities: [...prev.facilities, trimmedName]
      }));
      setNewFacilityName('');
    } else if (newPlace.facilities.includes(trimmedName)) {
        alert('Facility already added.');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setNewPlace(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facilityToRemove)
    }));
  };

  /**
   * Utility to validate JSON string input.
   */
  const validateJson = (jsonString, fieldName) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error(`Invalid JSON format for ${fieldName}: ${e.message}`);
    }
  };

  // --- API Handlers ---

  const addPlace = async () => {
    if (!newPlace.name || newPlace.latitude === 0 || newPlace.longitude === 0) {
      alert('Please fill in the name, latitude, and longitude.');
      return;
    }

    try {
        let operatingHoursObject;
        
        // --- 1. Construct Operating Hours JSON (Custom Handling) ---
        if (newPlace.operating_hours_type === 'fixed_hours') {
            // Validate and parse the custom JSON string
            operatingHoursObject = validateJson(newPlace.operating_hours_custom, 'Operating Hours');
        } else {
            // For '24_hour' or 'closed' types
            operatingHoursObject = { type: newPlace.operating_hours_type };
        }

        // --- 2. Construct Price JSON ---
        const priceObject = {
            entry_fee: newPlace.price_entry_fee,
            parking_bike: newPlace.price_parking_bike,
            parking_car: newPlace.price_parking_car,
            note: newPlace.price_note,
        };

        // --- 3. Construct Final Payload ---
        const placeData = {
            name: newPlace.name,
            category: newPlace.category,
            photo_url: newPlace.photo_url,
            latitude: newPlace.latitude,
            longitude: newPlace.longitude,
            description: newPlace.description,
            address: newPlace.address,
            kecamatan: newPlace.kecamatan,
            
            // Send constructed objects/arrays
            operating_hours: operatingHoursObject, 
            price: priceObject,
            facilities: newPlace.facilities,
        };

        const res = await axios.post('http://localhost:5000/api/places', placeData);
        alert(`Place added successfully with ID: ${res.data.id}`);
        
        // Update the list of places and reset form fields
        setPlaces(prev => [...prev, { ...placeData, id: res.data.id }]); 
        setNewPlace({
            name: '', category: '', photo_url: '', latitude: 0, longitude: 0, 
            description: '', address: '', kecamatan: '', 
            price_entry_fee: 0, price_parking_bike: 0, price_parking_car: 0, price_note: '',
            operating_hours_type: '24_hour', operating_hours_custom: '', facilities: []
        });
        setNewFacilityName('');

    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Invalid JSON')) {
          alert(err.message);
      } else {
          console.error('Error adding place:', err.response ? err.response.data : err);
          alert(`Failed to add place. Error: ${err.response?.data?.message || 'Server error'}`);
      }
    }
  };

  const deletePlace = async () => {
    if (!selectedPlaceIdToDelete) {
      alert('Please select a place to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/places/${selectedPlaceIdToDelete}`);
      alert('Place deleted successfully!');
      
      setPlaces(prev => prev.filter(p => p.id !== Number(selectedPlaceIdToDelete)));
      setSelectedPlaceIdToDelete('');
    } catch (err) {
      console.error('Error deleting place:', err.response ? err.response.data : err);
      alert(`Failed to delete place. Error: ${err.response?.data?.message || 'Server error'}`);
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
      <h1 style={styles.header}>🌍 Admin Place Management</h1>

      <section style={styles.section}>
        <h2>➕ Add New Place</h2>
        
        {/* Simple Text Fields */}
        <input style={styles.input} placeholder="Place Name" value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} />
        <input style={styles.input} placeholder="Category" value={newPlace.category} onChange={e => setNewPlace({...newPlace, category: e.target.value})} />
        <input style={styles.input} placeholder="Photo URL" value={newPlace.photo_url} onChange={e => setNewPlace({...newPlace, photo_url: e.target.value})} />
        <textarea style={styles.textarea} placeholder="Description" value={newPlace.description} onChange={e => setNewPlace({...newPlace, description: e.target.value})} />
        <input style={styles.input} placeholder="Address" value={newPlace.address} onChange={e => setNewPlace({...newPlace, address: e.target.value})} />
        <input style={styles.input} placeholder="Kecamatan" value={newPlace.kecamatan} onChange={e => setNewPlace({...newPlace, kecamatan: e.target.value})} />

        {/* --- Operating Hours (Custom Handling) --- */}
        <p style={{marginTop: '20px', fontWeight: 'bold', marginBottom: '0'}}>Operating Hours Type:</p>
        <select 
            style={styles.select}
            value={newPlace.operating_hours_type}
            onChange={e => setNewPlace({...newPlace, operating_hours_type: e.target.value, operating_hours_custom: ''})}
        >
            <option value="24_hour">24 Hour</option>
            <option value="fixed_hours">Fixed Hours (Custom JSON)</option>
            <option value="closed">Closed</option>
        </select>

        {/* Conditional Custom Hours Input */}
        {newPlace.operating_hours_type === 'fixed_hours' && (
            <textarea 
                style={styles.textarea}
                placeholder='Enter hours as JSON. E.g., {"mon": "9:00-17:00", "fri": "9:00-21:00"}' 
                value={newPlace.operating_hours_custom} 
                onChange={e => setNewPlace({...newPlace, operating_hours_custom: e.target.value})} 
            />
        )}


        {/* --- Price (Split Inputs) --- */}
        <p style={{marginTop: '20px', fontWeight: 'bold', marginBottom: '0'}}>Price Details (Enter 0 if free):</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <input 
                style={styles.input} type="number" step="0.01" min="0"
                placeholder="Entry Fee" 
                value={newPlace.price_entry_fee} 
                onChange={e => setNewPlace({...newPlace, price_entry_fee: Number(e.target.value)})} 
            />
            <input 
                style={styles.input} type="number" step="0.01" min="0"
                placeholder="Parking Bike" 
                value={newPlace.price_parking_bike} 
                onChange={e => setNewPlace({...newPlace, price_parking_bike: Number(e.target.value)})} 
            />
            <input 
                style={styles.input} type="number" step="0.01" min="0"
                placeholder="Parking Car" 
                value={newPlace.price_parking_car} 
                onChange={e => setNewPlace({...newPlace, price_parking_car: Number(e.target.value)})} 
            />
        </div>
        <input 
            style={styles.input}
            placeholder="Price Note (e.g., 'Gratis.')" 
            value={newPlace.price_note} 
            onChange={e => setNewPlace({...newPlace, price_note: e.target.value})} 
        />
        
        {/* --- Facilities (Dynamic Input) --- */}
        <p style={{marginTop: '20px', fontWeight: 'bold', marginBottom: '0'}}>Facilities:</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
                style={{...styles.input, margin: 0, flexGrow: 1}}
                placeholder="Enter new facility name" 
                value={newFacilityName} 
                onChange={e => setNewFacilityName(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFacility();
                    }
                }}
            />
            <button 
                style={{...styles.button, ...styles.successButton, margin: 0}}
                onClick={handleAddFacility}
            >
                ➕ Add Facility
            </button>
        </div>
        
        <ul style={styles.facilityList}>
            {newPlace.facilities.map((facility, index) => (
                <li key={index} style={styles.facilityItem}>
                    <span>{facility}</span>
                    <button 
                        style={styles.removeButton}
                        onClick={() => handleRemoveFacility(facility)}
                    >
                        Remove
                    </button>
                </li>
            ))}
            {newPlace.facilities.length === 0 && (
                 <p style={{ margin: '10px 0', color: '#666' }}>No facilities added yet.</p>
            )}
        </ul>

        {/* --- Coordinates (Split Inputs) --- */}
        <p style={{marginTop: '20px', fontWeight: 'bold', marginBottom: '0'}}>Coordinates:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            style={styles.input} type="number" step="any"
            placeholder="Longitude" 
            value={newPlace.longitude || ''} 
            onChange={e => setNewPlace({...newPlace, longitude: Number(e.target.value)})} 
          />
          <input 
            style={styles.input} type="number" step="any"
            placeholder="Latitude" 
            value={newPlace.latitude || ''} 
            onChange={e => setNewPlace({...newPlace, latitude: Number(e.target.value)})} 
          />
        </div>

        <p style={styles.coordinatesInfo}>
          Current Coordinates (Lng, Lat): **{newPlace.longitude}, {newPlace.latitude}**
        </p>
        
        <button 
          style={{...styles.button, ...styles.primaryButton}} 
          onClick={addPlace} 
          disabled={!newPlace.name}
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
            <option key={p.id} value={p.id}> 
              {p.name} (ID: {p.id})
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