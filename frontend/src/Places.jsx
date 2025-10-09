import React, { useState } from "react";
import "./PlacePage.css";

const images = [
  "/images/place1.jpg",
  "/images/place2.jpg",
  "/images/place3.jpg",
];

const reviews = [
  { id: 1, user: "Alice", comment: "Amazing place!", rating: 5 },
  { id: 2, user: "Bob", comment: "Great experience!", rating: 4 },
];

export default function PlacePage({
  lat = -0.843072,
  lng = 119.8832517,
  placeName = "Beautiful Palace",
  description = "A historical landmark located in the heart of the city. Stunning architecture and gardens await visitors.",
}) {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = () => {
    if (!comment) return;
    alert(`Comment submitted: ${comment}`);
    setComment("");
  };

  const googleMapLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="place-page-container">
      {/* Explanatory */}
      <section className="place-explanation">
        <h1>{placeName}</h1>
        <p>{description}</p>
      </section>

      {/* Image Gallery */}
      <section className="place-images">
        {images.map((img, idx) => (
          <div key={idx} className="place-img-card">
            <img src={img} alt={`Place ${idx + 1}`} />
          </div>
        ))}
      </section>

      {/* Google Map */}
      <section className="place-map">
        <h2>Location</h2>
        <iframe
          title="Place Map"
          width="100%"
          height="300"
          style={{ borderRadius: "12px", border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        ></iframe>
        <button
          className="google-map-btn"
          onClick={() => window.open(googleMapLink, "_blank")}
        >
          Open in Google Maps
        </button>
      </section>

      {/* Reviews */}
      <section className="place-reviews">
        <h2>Reviews</h2>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <strong>{r.user}</strong>
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < r.rating ? "star filled" : "star"}>★</span>
                ))}
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        <div className="review-form">
          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Submit</button>
        </div>
      </section>
    </div>
  );
}
