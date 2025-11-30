import React from 'react';

// This functional component is designed to render a single tourism place item.
// It assumes it receives a 'place' object prop matching the MySQL table structure.
const PlaceCard = ({ place }) => {
  // Ensure JSON fields are parsed, as they are stored as strings in MySQL
  const operatingHours = place?.operating_hours ? JSON.parse(place.operating_hours) : {};
  const facilities = place?.facilities ? JSON.parse(place.facilities) : [];

  // Helper function for title case, for better presentation
  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const statusText = operatingHours.type === '24_hour' 
    ? 'Open 24 Hours' 
    : 'Hours available';

  const statusColor = operatingHours.type === '24_hour' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-2xl overflow-hidden md:max-w-lg transition duration-300 hover:shadow-3xl transform hover:-translate-y-1">
      {/* Image Placeholder or Actual Image */}
      <div className="h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src={place?.photo_url || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(place?.name || 'No Image')}`} 
          alt={place?.name || "Tourism Place"}
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found"; }}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {toTitleCase(place?.category)}
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {statusText}
          </span>
        </div>
        
        <h1 className="block mt-1 text-2xl leading-tight font-extrabold text-gray-900">
          {place?.name}
        </h1>
        
        <p className="mt-2 text-gray-500 line-clamp-3">
          {place?.description}
        </p>

        <div className="mt-4 border-t pt-4">
          <p className="text-gray-600 font-medium">Location:</p>
          <p className="text-sm text-gray-700">{place?.address}, {toTitleCase(place?.kecamatan)}</p>
        </div>

        {facilities.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600 font-medium mb-2">Key Facilities:</p>
            <div className="flex flex-wrap gap-2">
              {facilities.slice(0, 3).map((facility, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
                >
                  {facility}
                </span>
              ))}
              {facilities.length > 3 && (
                 <span className="px-3 py-1 text-xs rounded-full bg-gray-300 text-gray-700">
                   +{facilities.length - 3} more
                 </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage to make the file runnable:
const App = () => {
    // Mock data structure matching the data retrieved from MySQL
    const mockPlace = {
        id: 1,
        name: "Pantai Kamnel",
        category: "pantai",
        description: "Pantai Kamnel is a beautiful beach offering views of the Gawalise mountains and stunning sunsets. It's a popular spot for locals.",
        address: "Jl kaombona, talise",
        kecamatan: "mantikulore",
        operating_hours: '{"type": "24_hour"}',
        price: '{"entry_fee": 0.0, "parking_bike": 2000.0}',
        facilities: '["Area parkir", "Toilet umum", "Cafe", "Spot foto", "Warung Kuliner"]',
        latitude: -0.89972,
        longitude: 119.82978,
        photo_url: "https://files.catbox.moe/pjx06w.jpg"
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <PlaceCard place={mockPlace} />
        </div>
    );
}

export default App;