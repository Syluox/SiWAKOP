import React from "react";

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <div className="about-card">
          <div className="about-image" aria-hidden>
            <img src="/dum-img.jpg" alt="Pemandangan Palu" />
          </div>

          <div className="about-content">
            <h1>About SiWAKOPs</h1>
            <p>
              SiWAKOPs membantu Anda menemukan tempat-tempat menarik di Palu dan sekitarnya. Kami
              merangkum rekomendasi, lokasi, dan tips agar perjalanan Anda lebih mudah dan
              menyenangkan.
            </p>
            <a className="about-cta" href="#">Learn more →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
