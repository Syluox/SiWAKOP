//===============================================
// EXPORT STYLE
//===============================================
// NOTE: Custom CSS imports are removed, assuming Tailwind is configured globally.
// import "./style/App.css";
// import "./style/Media_768.css";
// import "./style/media_900.css";

//===============================================
// IMPORT DEPENDENCIES
//===============================================
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';
// 💡 IMPORT LUCIDE ICONS FOR NAVBAR AND OVERLAYS
import { Menu, X, LogIn, LogOut, ChevronDown, User, AlertTriangle } from 'lucide-react';

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
    // EFFECT: NAVBAR SCROLL TRANSPARENCY (TAILWIND ADAPTATION)
    //=============================================
    useEffect(() => {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;
        
        const onScroll = () => {
            if (window.scrollY > 0) {
                // Tailwind classes for solid dark background with slight opacity and shadow
                navbar.classList.add("bg-gray-900/90", "shadow-md");
                navbar.classList.remove("bg-transparent");
            } else {
                // Tailwind class for fully transparent background
                navbar.classList.add("bg-transparent");
                navbar.classList.remove("bg-gray-900/90", "shadow-md");
            }
        };
        
        onScroll(); // Initial check
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
    // AUTH HANDLERS (UNCHANGED LOGIC)
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
            alert("⚠️ Server error, please try again later.");
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
            {/* NAVBAR (Tailwind Conversion) */}
            {/* fixed top-0 w-full z-50 controls position and stacking */}
            <nav className={`navbar fixed top-0 w-full z-50 transition-all duration-300 ${menuOpen ? "h-screen bg-gray-900" : "bg-transparent h-16"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* MENU TOGGLE BUTTON - Using Lucide Icons */}
                        <button
                            className="text-white hover:text-gray-300 md:hidden p-2 transition duration-200"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {/* Toggle between Menu and X icon */}
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                        
                        <img className="h-8 w-auto site-logo" src="" alt="Site Logo" />
                        <h1 className="text-xl font-bold text-white site-title">SiWAKOP</h1>
                    </div>

                    {/* Navigation Menu (Tailwind responsive implementation) */}
                    <ul className={`
                        md:flex md:space-x-8 md:relative md:bg-transparent md:h-auto md:w-auto md:p-0 
                        ${menuOpen 
                            ? "flex flex-col absolute top-16 left-0 w-full h-full bg-gray-900 p-4 space-y-4 items-start" 
                            : "hidden"
                        }
                    `}>
                        <li className="w-full md:w-auto">
                            <a href="#" onClick={closeMenu} className="block py-2 px-3 text-lg font-medium text-white hover:text-yellow-400 transition duration-150">Home</a>
                        </li>

                        {/* Dropdown Menu - uses 'group' class for hover activation */}
                        <li className="relative group w-full md:w-auto dropdown">
                            <a 
                                href="#explore" 
                                onClick={(e) => {e.preventDefault(); scrollToExplore();}} 
                                className="flex items-center py-2 px-3 text-lg font-medium text-white hover:text-yellow-400 transition duration-150"
                            >
                                Jelajah <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
                            </a>
                            <ul className="dropdown-menu md:absolute md:top-full md:left-0 md:mt-2 md:w-48 bg-gray-800 shadow-lg rounded-md hidden group-hover:block transition-all duration-300">
                                <li><a href="#nature" onClick={handleExploreItemClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-yellow-500 hover:text-gray-900">Pemandangan</a></li>
                                <li><a href="#culture" onClick={handleExploreItemClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-yellow-500 hover:text-gray-900">Hiburan</a></li>
                                <li><a href="#food" onClick={handleExploreItemClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-yellow-500 hover:text-gray-900">Budaya</a></li>
                                <li><a href="#other" onClick={handleExploreItemClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-yellow-500 hover:text-gray-900">Lainya</a></li>
                            </ul>
                        </li>

                        <li className="w-full md:w-auto">
                            <a href="#recommend" onClick={(e) => {e.preventDefault(); scrollToRecommend(); closeMenu();}} className="block py-2 px-3 text-lg font-medium text-white hover:text-yellow-400 transition duration-150">Rekomendasi</a>
                        </li>

                        <li className="w-full md:w-auto">
                            <a href="#about" onClick={closeMenu} className="block py-2 px-3 text-lg font-medium text-white hover:text-yellow-400 transition duration-150">About</a>
                        </li>

                        {/* Login or Logout Button (Using Lucide Icons) */}
                        <li className="w-full md:w-auto pt-2 md:pt-0">
                            {loggedIn ? (
                                <button className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 w-full md:w-auto" onClick={handleLogout}>
                                    <LogOut size={20} />
                                    <span>Logout ({username})</span>
                                </button>
                            ) : (
                                <button
                                    className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200 w-full md:w-auto"
                                    onClick={() => {
                                        setShowLogin(true);
                                        closeMenu();
                                    }}
                                >
                                    <LogIn size={20} />
                                    <span>Login</span>
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* HEADER (Tailwind Conversion) */}
            {/* The 'landing-page' class would typically define the background image */}
            <header className="landing-page relative h-screen w-full flex items-center justify-center bg-cover bg-center">
                {/* Overlay for darkening the background image */}
                <div className="absolute inset-0 bg-black opacity-50 header-overlay"></div>
                
                <div className="relative z-10 text-center text-white landing-content">
                    <div className="welcome-text space-y-2">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                            <TypingGreeting deletingSpeed={80} typingSpeed={100} pause={1500} />
                        </h1>
                        <h2 className="text-xl md:text-3xl font-light">TO</h2>
                        <h1 className="text-6xl md:text-8xl font-black">PALU</h1>
                    </div>
                    <div className="mt-8">
                        <FadingQuote />
                    </div>
                </div>
            </header>
            
            {/* LOGIN OVERLAY (Tailwind Conversion) */}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 overlay" onClick={() => setShowLogin(false)}>
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md login-card" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back</h2>
                        <div className="space-y-4">
                            {/* Input with Lucide Icon */}
                            <div className="relative">
                                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Username or Email" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                            {/* Input with Lucide Icon */}
                            <div className="relative">
                                <LogIn size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="password" placeholder="Password" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-200 login-submit" onClick={handleLogin}>Login</button>
                        <p className="mt-4 text-center text-gray-600 login-footer">
                            Don’t have an account? 
                            <a href="#" className="text-yellow-500 hover:text-yellow-600 font-semibold ml-1" onClick={() => {setShowLogin(false); setShowRegister(true);}}>
                                Register
                            </a>
                        </p>
                    </div>
                </div>
            )}

            {/* REGISTER OVERLAY (Tailwind Conversion) */}
            {showRegister && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 overlay" onClick={() => setShowRegister(false)}>
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md login-card" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="New Username" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <input type="password" placeholder="New Password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        {/* Error Message with Lucide Icon */}
                        {regInVal && (
                            <p className="flex items-center text-sm text-red-600 mt-2 font-medium reg-error">
                                <AlertTriangle size={16} className="mr-1" />
                                {regErrTxt}!
                            </p>
                        )}
                        <button className="w-full mt-6 bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-200 login-submit" onClick={handleRegister}>Register</button>
                        <p className="mt-4 text-center text-gray-600 login-footer">
                            Already have an account?{" "}
                            <a href="#" className="text-yellow-500 hover:text-yellow-600 font-semibold ml-1" onClick={() => { setShowRegister(false); setShowLogin(true); }}>
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