import React, { useState, useEffect, useCallback } from 'react';


// --- INLINE SVG ICONS (Self-contained replacements for lucide-react) ---

// Icon component structure helper
const Icon = ({ children, size = 18, className = "", fill = "none" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={fill} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

// Specific Icons (Based on Lucide shapes)
const LogOut = (props) => (
    <Icon {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </Icon>
);
const Map = (props) => (
    <Icon {...props}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>
    </Icon>
);
const MessageSquare = (props) => (
    <Icon {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </Icon>
);
const ListTodo = (props) => (
    <Icon {...props}>
        <rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 12 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
    </Icon>
);
const Settings = (props) => (
    <Icon {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.09a2 2 0 0 0-2.73.73l-.75 1.3a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.75 1.3a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2-0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.75-1.3a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.75-1.3a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </Icon>
);
const X = (props) => (
    <Icon {...props}>
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </Icon>
);
const Save = (props) => (
    <Icon {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </Icon>
);
const Star = ({ fill, ...props }) => (
    <Icon {...props} fill={fill}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </Icon>
);
const UserCog = (props) => (
    <Icon {...props}>
        <circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15v.2a2 2 0 0 0 1 1.72l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 1-1.73V15"/><path d="M15 22v-3.37a4 4 0 0 0-1.4-2.75"/><path d="M21 22v-3.5"/><path d="M7.17 12c-.74-2.22-3.15-3.69-5.86-3.79-1.25-.04-2.25.96-2.25 2.25v.75c0 1.29 1 .19 2.25.19h5.86c2.71.1 5.12 1.57 5.86 3.79"/>
    </Icon>
);
// --- END INLINE SVG ICONS ---


// --- MOCK DATA ---
const MOCK_DATA = {
    visitedPlaces: [
        { id: 1, name: "Pantai Kamnel", category: "Pantai", photo_url: "https://placehold.co/64x64/374151/ffffff?text=PK", kecamatan: "Mantikulore"},
        { id: 2, name: "Taman Nasional Hassanudin", category: "Taman", photo_url: "https://placehold.co/64x64/374151/ffffff?text=TH", kecamatan: "Palu Timur"},
        { id: 3, name: "Air Terjun Wera", category: "Alam", photo_url: "https://placehold.co/64x64/374151/ffffff?text=AW", kecamatan: "Sigi"},
    ],
    userReviews: [
        { id: 101, placeName: "Pantai Kamnel", rating: 5, date: "2024-10-20", text: "Sunset here was magical! Highly recommended spot." },
        { id: 102, placeName: "Taman Nasional Hassanudin", rating: 4, date: "2024-09-15", text: "Great public space, perfect for exercise in the morning." },
    ],
    plannedTrips: [
        { id: 201, placeName: "Museum Sulawesi Tengah", date: "2024-12-05", status: "Upcoming" },
        { id: 202, placeName: "Kebun Kopi Rano", date: "2024-12-24", status: "Holiday Plan" },
    ],
};

// --- Sub-Component for Settings Modal ---
const SettingsModal = ({ show, onClose, onSave, currentName }) => {
    const [newName, setNewName] = useState(currentName);

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 ring-4 ring-indigo-500/10">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition p-1 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>
                
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                </label>
                <input
                    id="displayName"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-6 focus:ring-2 outline-none"
                    placeholder="Enter new display name"
                />

                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition shadow-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(newName)} 
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                        <Save size={16} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Renderer Helper Components ---

const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

const PlaceCard = ({ place }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:ring-2 hover:ring-indigo-500/50 cursor-pointer">
        <div className="flex items-center space-x-3">
            <img 
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-indigo-100 border border-indigo-200" 
                src={place.photo_url} 
                alt={place.name}
                onError={(e) => e.target.src = `https://placehold.co/48x48/9ca3af/ffffff?text=P`}
            />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{place.name}</p>
                <p className="text-xs text-indigo-700 mt-0.5 font-medium">{toTitleCase(place.category)}</p>
                <p className="text-xs text-gray-500">{toTitleCase(place.kecamatan)}</p>
            </div>
        </div>
    </div>
);

const ReviewCard = ({ review }) => {
    return (
        <div className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 transition duration-300 hover:shadow-xl hover:bg-yellow-50 cursor-default">
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800">{review.placeName}</p>
                <div className="flex items-center space-x-1 text-yellow-600">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-semibold">{review.rating}</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 italic mt-2 border-l pl-3 border-gray-200">"{review.text}"</p>
            <p className="text-xs text-gray-400 mt-3">Written on: {review.date}</p>
        </div>
    );
};

const PlanCard = ({ plan }) => (
    <div className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-teal-500 transition duration-300 hover:shadow-xl hover:bg-teal-50 cursor-default">
        <div className="flex justify-between items-center">
            <p className="font-bold text-gray-800">{plan.placeName}</p>
            <span className="text-xs text-teal-700 font-semibold bg-teal-100 px-2 py-0.5 rounded-full">{plan.status}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Scheduled for: {plan.date}</p>
    </div>
);

// --- Main Component: Renamed to UserDashboard ---

const UserDashboard = () => { 
    // 1. State Initialization
    const [activeTab, setActiveTab] = useState('visited');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [displayName, setDisplayName] = useState(() => 
        // Using localStorage for mock persistence
        localStorage.getItem('siwakopDisplayName') || 'Traveler Palu'
    );
    
    // Static user info
    const userId = 'user-f1b2c3d4-palu';
    const profileImageUrl = "https://placehold.co/100x100/6366f1/ffffff?text=TP";

    // Tab configuration with Icon components
    const tabs = [
        { id: 'visited', label: 'Visited Places', Icon: Map },
        { id: 'reviews', label: 'My Reviews', Icon: MessageSquare },
        { id: 'plans', label: 'Trip Plans', Icon: ListTodo },
        { id: 'settings', label: 'Settings', Icon: Settings },
    ];

    // 2. Event Handlers
    const handleSaveDisplayName = (newName) => {
        const trimmedName = newName.trim();
        if (trimmedName && trimmedName !== displayName) {
            setDisplayName(trimmedName);
            localStorage.setItem('siwakopDisplayName', trimmedName);
        }
        setShowSettingsModal(false);
    };

    const handleLogout = () => {
        console.log('User logged out (simulated)');
    };

    // 3. Tab Content Renderer
    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case 'visited':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_DATA.visitedPlaces.map(place => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                );
            case 'reviews':
                return (
                    <div className="space-y-4">
                        {MOCK_DATA.userReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                );
            case 'plans':
                return (
                    <div className="space-y-4">
                        {MOCK_DATA.plannedTrips.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Account Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Display Name</p>
                                <p className="text-lg font-bold text-gray-800">{displayName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">User ID</p>
                                <p className="text-sm font-mono text-gray-600 break-all">{userId}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowSettingsModal(true)}
                            className="mt-6 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                        >
                            <UserCog size={18} />
                            <span>Edit Profile and Display Name</span>
                        </button>
                    </div>
                );
            default:
                return <p className="text-gray-500 text-center py-10">Select a tab to view content.</p>;
        }
    }, [activeTab, displayName, userId]); // Dependency array

    // 4. Component Structure (JSX)
    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-100 font-sans"> 
            
            {/* Dashboard Card Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
                
                {/* Header Section */}
                <header className="p-6 sm:p-8 bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={profileImageUrl}
                            className="w-16 h-16 rounded-full border-4 border-indigo-300 object-cover" 
                            alt="Profile" 
                        />
                        <div>
                            <h2 className="text-2xl font-extrabold">{displayName}</h2>
                            <p className="text-sm font-light opacity-80">ID: {userId}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="mt-4 sm:mt-0 px-4 py-2 border border-white rounded-lg text-sm font-semibold hover:bg-white hover:text-indigo-600 transition flex items-center space-x-2 shadow-sm"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </header>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-8 pt-4">
                        {tabs.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center space-x-2 pb-3 text-sm font-medium transition duration-200
                                    ${activeTab === id 
                                        ? 'border-b-2 border-indigo-600 text-indigo-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <main className="p-4 sm:p-8 bg-gray-50 min-h-64">
                    {renderTabContent()}
                </main>
            </div>
            
            {/* Settings Modal */}
            <SettingsModal
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                onSave={handleSaveDisplayName}
                currentName={displayName}
            />
        </div>
    );
};

export default UserDashboard;