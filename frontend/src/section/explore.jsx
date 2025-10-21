import React from "react";
import "../App.css";

class ExploreSection extends React.Component {
    
    // Define the breakpoint to match your CSS media query
    MOBILE_BREAKPOINT = 768;

    state = {
        expandedCardId: null,
        // Initialize isMobile state based on current window width
        isMobile: window.innerWidth <= this.MOBILE_BREAKPOINT, 
    };

    // Card data
    cardData = [
        { id: 1, title: "Pemandangan", description: "Nikmati pemandangan indah di kota Palu dan sekitarnya, mulai dari perbukitan hingga pantai yang menawan. Tempat sempurna untuk fotografi dan relaksasi." },
        { id: 2, title: "Hiburan", description: "Temukan berbagai pusat hiburan dan rekreasi yang seru, termasuk bioskop, pusat perbelanjaan modern, dan tempat nongkrong kekinian." },
        { id: 3, title: "Taman", description: "Jelajahi taman-taman kota yang hijau dan asri. Ideal untuk olahraga pagi, piknik keluarga, atau sekadar menikmati udara segar di tengah kesibukan." },
        { id: 4, title: "Lainnya", description: "Beragam destinasi unik lainnya yang patut dikunjungi, seperti situs bersejarah, pasar tradisional, dan pusat kuliner lokal yang khas." },
    ];
    
    render() {
        // Conditional Rendering: Show Expanded View
        if (this.state.expandedCardId !== null) {
            return this.renderExpandedView();
        }

        const { isMobile } = this.state;

        // Conditional Rendering: Show Main Section
        return (
            <section id="explore-section">
                <div className="container">
                    <div className="main-text">
                        <h1>PLACE TO EXPLORE</h1> 
                        <p>Temukan tempat-tempat indah di Palu dan sekitarnya dengan SiWAKOPs.</p>
                    </div>

                    <div className="explore-container">
                        {this.cardData.map((data) => {
                            const isEven = data.id % 2 === 0; 
                            // Reverse items 2 and 4 (even IDs)
                            const reverseClass = isEven ? 'explore-item-reverse' : ''; 
                            
                            // Conditional Card Click: Only apply the onClick to the entire card if it's mobile
                            const cardClickHandler = isMobile 
                                ? () => this.handleCardClick(data.id) 
                                : undefined;

                            return (
                                <div 
                                    key={data.id} 
                                    // Use 'pc-cursor' class for better visual feedback on desktop (defined in CSS)
                                    className={`about-card explore-item ${reverseClass} ${!isMobile ? 'pc-cursor' : ''}`}
                                >
                                    <div className="about-image">
                                        <img src="/dum-img.jpg" alt={`Nature ${data.id}`} />
                                    </div>
                                    <div className="about-content">
                                        <h1>{data.title}</h1>
                                        <p>{data.description}</p>
                                        
                                        {/* "Lebih Lanjut" Button: The primary click target on PC */}
                                        <a 
                                            className="about-cta explore-cta" 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Only open overlay on mobile; on PC do nothing (or navigate if desired)
                                                if (this.state.isMobile) this.handleCardClick(data.id);
                                            }}
                                        >
                                            Lebih Lanjut →
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default ExploreSection;