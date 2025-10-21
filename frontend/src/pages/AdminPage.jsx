import { useState } from "react";
import "../App.css";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("places");

  return (
    <div className="admin-container">
      {/* Navbar */}
      <nav className="navbar nav-solid">
        <div className="container row a-center j-between">
          <h1 className="site-title">Admin Panel</h1>
          <ul className="nav-menu">
            <li><a href="#" onClick={() => setActiveTab("places")}>Places</a></li>
            <li><a href="#" onClick={() => setActiveTab("map")}>Map Points</a></li>
            <li><a href="#" onClick={() => setActiveTab("images")}>Images</a></li>
            <li><a href="#" onClick={() => setActiveTab("requests")}>Requests</a></li>
            <li><a href="#" onClick={() => setActiveTab("comments")}>Comments</a></li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="admin-content container">
        {/* PLACES MANAGEMENT */}
        {activeTab === "places" && (
          <section className="admin-section">
            <h2>Add New Place</h2>
            <div className="admin-card">
              <input type="text" placeholder="Place Name" />
              <textarea placeholder="Description"></textarea>
              <input type="text" placeholder="Category (e.g. Nature, Culture, Food)" />
              <input type="text" placeholder="Latitude" />
              <input type="text" placeholder="Longitude" />
              <button className="login-btn">Add Place</button>
            </div>

            <h2>Existing Places</h2>
            <div className="admin-card">
              <p><strong>Pantai Talise</strong> — Nature</p>
              <button className="login-btn">Edit</button>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Delete</button>
            </div>
            <div className="admin-card">
              <p><strong>Danau Lindu</strong> — Nature</p>
              <button className="login-btn">Edit</button>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Delete</button>
            </div>
          </section>
        )}

        {/* MAP POINTS */}
        {activeTab === "map" && (
          <section className="admin-section">
            <h2>Add New Map Point</h2>
            <div className="admin-card">
              <input type="text" placeholder="Point Name" />
              <input type="text" placeholder="Latitude" />
              <input type="text" placeholder="Longitude" />
              <textarea placeholder="Short description"></textarea>
              <button className="login-btn">Add to Map</button>
            </div>

            <h2>Existing Points</h2>
            <div className="admin-card">
              <p><strong>Pantai Talise:</strong> (-0.875, 119.870)</p>
              <button className="login-btn">Edit</button>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Remove</button>
            </div>
          </section>
        )}

        {/* IMAGES */}
        {activeTab === "images" && (
          <section className="admin-section">
            <h2>Upload Image for a Place</h2>
            <div className="admin-card">
              <select>
                <option>Select Place</option>
                <option>Pantai Talise</option>
                <option>Danau Lindu</option>
              </select>
              <input type="file" />
              <button className="login-btn">Upload</button>
            </div>

            <h2>Existing Images</h2>
            <div className="admin-card">
              <p><strong>Pantai Talise</strong> — talise.jpg</p>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Delete</button>
            </div>
          </section>
        )}

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <section className="admin-section">
            <h2>User Requests</h2>
            <div className="admin-card">
              <p><strong>User:</strong> traveler22</p>
              <p>Request: Add place “Gunung Gawalise”</p>
              <button className="login-btn">Approve</button>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Reject</button>
            </div>
          </section>
        )}

        {/* COMMENTS */}
        {activeTab === "comments" && (
          <section className="admin-section">
            <h2>Manage Comments</h2>
            <div className="admin-card">
              <p><strong>User:</strong> skylover</p>
              <p>“Beautiful view but a bit crowded.”</p>
              <button className="login-btn" style={{ background: "#555", color: "#fff" }}>Delete</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
