import React,{forwardRef} from "react";

const About = forwardRef((props, ref)   => {
  return (
    <section ref={ref} id="about" className="about-section">
      <div className="container about-container">
        <div className="about-card">

          <div className="about-content">
            <h1>Tentang SiWAKOP</h1>
            <p>
              SiWAKOP membantu Anda menemukan tempat-tempat menarik di Palu dan sekitarnya. Kami
              merangkum rekomendasi, lokasi, dan tips agar perjalanan Anda lebih mudah dan
              menyenangkan.
            </p>
          </div>
        </div>
      </div>
      <div className="made-by-text">
        2025 SiWAKOP. All rights reserved. <span className="made-by-text">Purity made by <a target="_blank" href="https://www.instagram.com/hakabatsu_" iges=" - Instagram">@Hakabatsu</a></span>
      </div>
    </section>
  );
});

export default About;
