//===============================================
// EXPORT STYLE
//===============================================
import "./style/App.css";
import "./style/Media_768.css";
import "./style/media_900.css";

//===============================================
// IMPORT DEPENDENCIES
//===============================================
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';

//===============================================
// IMPORT COMPONENTS
//===============================================
import { TypingGreeting } from "./comp/TypingGreeting";
import { FadingQuote } from "./comp/PaluQuote";
import About from "./section/About";
export { UserControler } from "./comp/usesrHandle.jsx";

//===============================================
// IMPORT SECTIONS
//===============================================
import ExploreSection from "./section/explore";
import RecommendSection from "./section/recomend";
import MapSection from "./section/mapSection";

//===============================================
// IMPORT PAGES
//===============================================
import UserPage from "./pages/UserPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { UserControler } from "./comp/usesrHandle.jsx";
import PlaceDetail from "./pages/PlaceDetail.jsx"

//===============================================
// MAPPING: MENU TEXT TO EXPLORE CARD ID
//===============================================
const MENU_TO_CARD_MAP = {
    'pemandangan': 1,
    'hiburan': 2,
    'budaya': 3,
    'lainya': 4,
};


//===============================================
// MAIN APP COMPONENT
//===============================================
function App() {

    //=============================================
    // STATE VARIABLES
    //=============================================
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [regErrTxt, setRegErrTxt] = useState("");
    const [regInVal, setRegInVal] = useState(false);
    
    // 🌟 CORE NEW STATE: To hold the card ID requested by the menu
    const [requestedCardId, setRequestedCardId] = useState(null); 
    //=============================================


    //=============================================
    // REFS AND HOOKS
    //=============================================
    const navigate = useNavigate();
    const reccomendRef = useRef(null);
    const aboutRef = useRef(null);
    const exploreRef = useRef(null);
    //=============================================


    //=============================================
    // EFFECT: NAVBAR SCROLL TRANSPARENCY
    //=============================================
    useEffect(() => {
        const navbar = document.querySelector(".navbar");
        const onScroll = () => {
            if (window.scrollY > 0) {
                navbar.classList.replace("nav-transp", "nav-solid");
            } else {
                navbar.classList.replace("nav-solid", "nav-transp");
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    //=============================================


    //=============================================
    // SCROLL HANDLERS
    //=============================================
    const closeMenu = () => setMenuOpen(false);
    const scrollToExplore = () => {
    if (exploreRef.current) {
        setRequestedCardId(null); // Reset any previous requests
        exploreRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    };

    const scrollToRecommend = () => {
        if (reccomendRef.current) {
            reccomendRef.current.scrollIntoView({ behavior: 'smooth',block: 'start' });
        }
    };
    
    // 🌟 HANDLER: Scrolls to ExploreSection and requests card expansion
    const handleExploreItemClick = useCallback((e) => {
        e.preventDefault();
        
        const linkText = e.currentTarget.textContent.toLowerCase();
        const cardId = MENU_TO_CARD_MAP[linkText];
        
        if (cardId) {
            // 1. Set the state to request the specific card ID be opened
            setRequestedCardId(cardId);
            
            // 2. Scroll to the ExploreSection using its ref
            if (exploreRef.current) {
                exploreRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
        
        closeMenu(); 
    }, []);
    //=============================================


    //=============================================
    // AUTH HANDLERS
    //=============================================
    const handleLogin = async () => { 
        const usernameValue = document.querySelector("input[placeholder='Username or Email']").value;
        const passwordValue = document.querySelector("input[placeholder='Password']").value;
        const loginHandler = new UserControler.LoginControl(usernameValue,passwordValue);
        try {
            const data= await loginHandler.handleLogin();
            
            if(data.token && data.isAdmin){
                const userToNavigate = data.username || usernameValue;
                alert("✅ " + data.message);
                setLoggedIn(true);
                setUsername(usernameValue);
                setShowLogin(false);
                alert(localStorage.getItem('token'));
                navigate(`/admin`);
                return;
            }
            if (data.token) {
                const userToNavigate = data.username || usernameValue;
                alert("✅ " + data.message);
                setLoggedIn(true);
                setUsername(usernameValue);
                setShowLogin(false);
                alert(localStorage.getItem('token'));
                navigate(`/user/${userToNavigate}`);
            } 
            else {
                alert("❌ " + data.message);
            }
        } catch (err) {
            alert("⚠️ Server error, please try again later.", err);
        }
    };
    
    const handleLogout = () => {
        setLoggedIn(false);
        setUsername("");
        alert("👋 You have logged out successfully.");
        setUsername("");
        navigate("/");
    };
    
    const handleRegister = async () => { 
        const usernameValue = document.querySelector("input[placeholder='New Username']").value;
        const emailValue = document.querySelector("input[placeholder='Email']").value;
        const passwordValue = document.querySelector("input[placeholder='New Password']").value;

        if(usernameValue.length < 5){
            setRegErrTxt("Username must be at least 5 characters long");
            setRegInVal(true);
            return;
        }

        if (passwordValue.length < 6) {
            setRegErrTxt("Password must be at least 6 characters long");
            setRegInVal(true);
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(emailValue)) {
            setRegErrTxt("Email must contain '@' and end with '.com'");
            setRegInVal(true);
            return;
        }
        
        try {
            const res = await axios.post("http://localhost:5000/api/user/register", {
                username: usernameValue,
                email: emailValue,
                password: passwordValue
            });
            
            if (res.data.success) {
                alert("✅ Registered successfully");
                setShowRegister(false);
                setShowLogin(true);
                setUsername(usernameValue);

            } else {
                setRegErrTxt(res.data.message || "Registration failed");
                setRegInVal(true);
            }
        } catch (err) {
            setRegErrTxt(err.response?.data?.message || "⚠️ Server error, try again later.");
            setRegInVal(true);
        }
    };
    //=============================================


    return (
        <>
        {/* NAVBAR */}
            <nav className={`navbar nav-transp ${menuOpen ? "menu-open" : ""}`}>
                <div className="container row a-center j-between">
                    <div className="row a-center">
                        <button
                            className={`menu-toggle ${menuOpen ? "active" : ""}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span></span><span></span><span></span>
                        </button>
                        <img className="site-logo" src=""/>
                        <h1 className="site-title">SiWAKOP</h1>
                    </div>

                    <ul className={`nav-menu ${menuOpen ? "show" : ""}`}>
                        <li><a href="#" onClick={closeMenu}>Home</a></li>

                        <li className="dropdown">
                            <a href="#explore" onClick={(e) => {e.preventDefault(); scrollToExplore();}}>Jelajah ▾</a>
                            <ul className="dropdown-menu">
                                {/* 🌟 Use the new handler here */}
                                <li><a href="#nature" onClick={handleExploreItemClick}>Pemandangan</a></li>
                                <li><a href="#culture" onClick={handleExploreItemClick}>Hiburan</a></li>
                                <li><a href="#food" onClick={handleExploreItemClick}>Budaya</a></li>
                                <li><a href="#food" onClick={handleExploreItemClick}>Lainya</a></li>
                            </ul>
                        </li>

                        <a href="#recommend" onClick={(e) => {e.preventDefault(); scrollToRecommend(); closeMenu();}}>Rekomendasi</a>

                        <li><a href="#about" onClick={closeMenu}>About</a></li>

                        {/* Login or Logout Button */}
                        <li>
                            {loggedIn ? (
                                <button className="login-btn" onClick={handleLogout}>
                                    Logout ({username})
                                </button>
                            ) : (
                                <button
                                    className="login-btn"
                                    onClick={() => {
                                        setShowLogin(true);
                                        closeMenu();
                                    }}
                                >
                                    Login
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* HEADER */}
            <header className="landing-page">
                <div className="header-overlay"></div>
                <div className="landing-content">
                    <div className="welcome-text">
                        <h1><TypingGreeting deletingSpeed={80} typingSpeed={100} pause={1500} /></h1>
                        <h2>TO</h2>
                        <h1>PALU</h1>
                    </div>
                    <FadingQuote />
                </div>
            </header>
            
            {/* LOGIN OVERLAY */}
            {showLogin && (
                <div className="overlay" onClick={() => setShowLogin(false)}>
                    <div className="login-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Welcome Back</h2>
                        <input type="text" placeholder="Username or Email" />
                        <input type="password" placeholder="Password" />
                        <button className="login-submit" onClick={handleLogin}>Login</button>
                        <p className="login-footer">
                            Don’t have an account? <a href="#" onClick={() => {setShowLogin(false); setShowRegister(true);}}>Register</a>
                        </p>
                    </div>
                </div>
            )}

            {/* REGISTER OVERLAY */}
            {showRegister && (
                <div className="overlay" onClick={() => setShowRegister(false)}>
                    <div className="login-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Create Account</h2>
                        <input type="text" placeholder="New Username" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="New Password" />
                        {regInVal && (<p className="reg-error">{regErrTxt}!</p>)}
                        <button className="login-submit " onClick={handleRegister}>Register</button>
                        <p className="login-footer">
                            Already have an account?{" "}
                            <a href="#" onClick={() => { setShowRegister(false); setShowLogin(true); }}>
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            )}
            
            <Routes>
                <Route path="/" element={
                    <>
                        <RecommendSection ref={reccomendRef}/>
                        {/* 🌟 PASS THE NEW PROPS HERE */}
                        <ExploreSection 
                            ref={exploreRef}
                            requestedCardId={requestedCardId}
                            setRequestedCardId={setRequestedCardId}
                        />
                        <MapSection/>
                        <About ref={aboutRef}/>
                    </>
                } />
            </Routes>
            
            <Routes>
                <Route path="/user/:username" element={<UserPage />} />
            </Routes>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} /> 
            </Routes>
            <Routes>
                <Route path="/detail/:id" element={<PlaceDetail/>}/>
            </Routes>
        </>
    );
}
export default App;