import { useEffect, useState,useRef} from "react";
import { Routes, Route,useNavigate  } from "react-router-dom";
import "./App.css";
import { TypingGreeting } from "./TypingGreeting";
import { FadingQuote } from "./PaluQuote";
import {cUser} from "../../backend/backendTranslator";
import About from "./section/About";
import axios from 'axios';

// Export Controller
export {UserControler} from "./usesrHandle.jsx";

// Section Export
import ExploreSection from "./section/explore";
import RecommendSection from "./section/recomend";
import MapSection from "./section/mapSection";

// Page Export
import UserPage from "./pages/UserPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { UserControler } from "./usesrHandle.jsx";


function App() {

  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [regErrTxt, setRegErrTxt] = useState("");
  const [regInVal, setRegInVal] = useState(false);

  //useRef for tracking mounted state
  const reccomendRef = useRef(null);

  // Handle navbar transparency
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

  // Handle login
  const handleLogin = async () => {
    const usernameValue = document.querySelector("input[placeholder='Username or Email']").value;
    const passwordValue = document.querySelector("input[placeholder='Password']").value;
    const loginHandler = new UserControler.LoginControl(usernameValue,passwordValue);
    try {
      const data= await loginHandler.handleLogin();
      //admin login
      if(data.token){
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
        navigate(`/user/${usernameValue}`);
      } 
      else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error, please try again later.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    alert("👋 You have logged out successfully.");
    setUsername("");
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const scrollToRecommend = () => {
    if (reccomendRef.current) {
      reccomendRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle register with Axios
  const handleRegister = async () => {
    const usernameValue = document.querySelector("input[placeholder='New Username']").value;
    const emailValue = document.querySelector("input[placeholder='Email']").value;
    const passwordValue = document.querySelector("input[placeholder='New Password']").value;

    if(usernameValue.length < 5){
      setRegErrTxt("Username must be at least 5 characters long");
      setRegInVal(true);
      return;
    }

    // Password length check
    if (passwordValue.length < 6) {
      setRegErrTxt("Password must be at least 6 characters long");
      setRegInVal(true);
      return;
    }
    // Simple email validation
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
              <a href="#explore" onClick={(e) => e.preventDefault()}>Jelajah ▾</a>
              <ul className="dropdown-menu">
                <li><a href="#nature" onClick={closeMenu}>Pemandangan</a></li>
                <li><a href="#culture" onClick={closeMenu}>Hiburan</a></li>
                <li><a href="#food" onClick={closeMenu}>Budaya</a></li>
                <li><a href="#food" onClick={closeMenu}>Lainya</a></li>
              </ul>
            </li>

            <a href="#recommend" onClick={(e) => e.preventDefault()}>Rekomendasi</a>

            <li><a href="#" onClick={closeMenu}>About</a></li>

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
            <MapSection/>
            <About />
          </>
      } />
      </Routes>
      <Routes>
        <Route path="/user/:username" element={<UserPage />} />
      </Routes>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Routes>

    </>
  );
}
export default App;