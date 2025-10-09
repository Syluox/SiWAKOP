import { useEffect, useState } from "react";
import "./App.css";
import { TypingGreeting } from "./TypingGreeting";
import { FadingQuote } from "./PaluQuote";
import {cUser} from "../../backend/backendTranslator";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [regerrtxt,regErrTxt] = useState("");
  const [reginval,regInVal] = useState(false);

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
    try {
      const res = await fetch("http://localhost:5000/api/auth/sulap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameValue, password: passwordValue }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        setLoggedIn(true);
        setUsername(usernameValue);
        setShowLogin(false);
      } else {
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
  };

  const closeMenu = () => setMenuOpen(false);

  // Handle register
const handleRegister = async () => {
  const usernameValue = document.querySelector("input[placeholder='New Username']").value;
  const emailValue = document.querySelector("input[placeholder='Email']").value;
  const passwordValue = document.querySelector("input[placeholder='New Password']").value;

  if(usernameValue.length<5){
    alert("❌ Username must be at least 5 characters long")
    return;
  }

  // Password length check
  if (passwordValue.length < 6) {
    alert("❌ Password must be at least 6 characters long");
    return;
  }
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
  if (!emailRegex.test(emailValue)) {
    alert("❌ Email must contain '@' and end with '.com'");
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/auth/register",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })    
  } catch (err) {
    alert("⚠️ Server error, try again later.");
  }};

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
            <h1 className="site-title">SiWAKOPs</h1>
          </div>

          <ul className={`nav-menu ${menuOpen ? "show" : ""}`}>
            <li><a href="#" onClick={closeMenu}>Home</a></li>

            <li className="dropdown">
              <a href="#explore" onClick={(e) => e.preventDefault()}>Jelajah ▾</a>
              <ul className="dropdown-menu">
                <li><a href="#nature" onClick={closeMenu}>Alam</a></li>
                <li><a href="#culture" onClick={closeMenu}>Budaya</a></li>
                <li><a href="#food" onClick={closeMenu}>Kuliner</a></li>
              </ul>
            </li>

            <li className="dropdown">
              <a href="#recommend" onClick={(e) => e.preventDefault()}>Rekomendasi ▾</a>
              <ul className="dropdown-menu">
                <li><a href="#hotels" onClick={closeMenu}>Hotel</a></li>
                <li><a href="#restaurants" onClick={closeMenu}>Restoran</a></li>
                <li><a href="#activities" onClick={closeMenu}>Aktivitas</a></li>
              </ul>
            </li>

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

      {/* EXPLORE */}
      <section id="explore">
        <div className="container">
          <div id="main-text">
            <h1>PLACE TO EXPLORE</h1>
            <p>Temukan tempat-tempat indah di Palu dan sekitarnya dengan SiWAKOPs.</p>
          </div>

          <div className="explore-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="exp-card">
                <img src="/dum-img.jpg" alt={`Nature ${i}`} />
                <div className="card-text">
                  <h1>Nature #{i}</h1>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At officia quasi tempora.</p>
                  <a href="#">Lebih Lanjut →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMEND */}
      <section id="recommend">
        <div className="container">
          <div id="main-text">
            <h1>RECOMMENDED PLACES</h1>
            <p>Berikut rekomendasi terbaik untuk Anda kunjungi saat di Palu.</p>
          </div>
          <div className="recom-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="recom-card">
                <div className="dummy-img"></div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            {reginval && (<p className="reg-error">{regErrTxt}!</p>)}
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
    </>
  );
}
export default App;
