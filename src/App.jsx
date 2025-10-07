import { useEffect, useState } from 'react'
import './App.css'
import { TypingGreeting } from './TypingGreeting'
import { FadingQuote } from './PaluQuote'

function App() {

    useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 0) {
        navbar.classList.remove('nav-transp');
        navbar.classList.add('nav-solid');
      } else {
        navbar.classList.remove('nav-solid');
        navbar.classList.add('nav-transp');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <section id='home'>
      <nav className='navbar nav-transp'>
        <button style={{display:'none'}}></button>
        <div className='row a-center'>
          <div className='dummy-logo logo'></div>
          <h1>SiWAKOPs</h1>
        </div>
        <div className='j-right row'>
          <div className='nav-select-content'>
            <ul className='row'>
              <li><a href="#">Home</a></li>
              <li><a href="#">Jelajah</a></li>
              <li><a href="#">Kategori</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <header>
        <div className='header-overlay'></div>
        <div className='landing-page column'>
          <div className='welcome-text'>
            <h1><TypingGreeting deletingSpeed={80} typingSpeed={100} pause={1500}></TypingGreeting></h1>
            <h2>TO</h2>
            <h1>PALU</h1>
          </div>
          <div id='fading-quote'>
            <FadingQuote></FadingQuote>
          </div>
        </div>
      </header>

    </section>
    <section id='explore'>
      <div className='container'>

        <div id='main-text' className='a-center j-center'>
          <h1>PLACE TO EXPLORE</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, cum, eum repellendus voluptate nobis iste enim sunt libero unde ducimus cupiditate exercitationem illo corporis quibusdam animi quaerat laboriosam porro rem!</p>
        </div>

        <div id='nature' className='row'>
          <div className='exp-container oreder-frist'>
            <img src="public/dum-img.jpg" alt="" />
          </div>
          <div className='exp-container'>
            <div className='card-text'>
              <h1>Nature</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At officia quasi tempora. Numquam modi asperiores iste vero reiciendis excepturi ipsam harum praesentium mollitia officia magnam, repellendus dicta porro quod officiis!</p>
              <hr></hr>
              <a href=''>Lebih Lanjut </a>
            </div>
          </div>
        </div>

        <div id='nature' className='row'>

          <div className='exp-container'>
            <div className='card-text'>
              <h1>Nature</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At officia quasi tempora. Numquam modi asperiores iste vero reiciendis excepturi ipsam harum praesentium mollitia officia magnam, repellendus dicta porro quod officiis!</p>
              <hr></hr>
              <a href=''>Lebih Lanjut </a>
            </div>
          </div>
          <div className='exp-container oreder-frist'>
            <img src="public/dum-img.jpg" alt="" />
          </div>
        </div>

        <div id='nature' className='row'>
          <div className='exp-container oreder-frist'>
            <img src="public/dum-img.jpg" alt="" />
          </div>
          <div className='exp-container'>
            <div className='card-text'>
              <h1>Nature</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At officia quasi tempora. Numquam modi asperiores iste vero reiciendis excepturi ipsam harum praesentium mollitia officia magnam, repellendus dicta porro quod officiis!</p>
              <hr></hr>
              <a href=''>Lebih Lanjut </a>
            </div>
          </div>
        </div>

        <div id='nature' className='row'>

          <div className='exp-container'>
            <div className='card-text'>
              <h1>Nature</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At officia quasi tempora. Numquam modi asperiores iste vero reiciendis excepturi ipsam harum praesentium mollitia officia magnam, repellendus dicta porro quod officiis!</p>
              <hr></hr>
              <a href=''>Lebih Lanjut </a>
            </div>
          </div>
          <div className='exp-container oreder-frist'>
            <img src="public/dum-img.jpg" alt="" />
          </div>
        </div>
      </div>  
    </section>

    <section id='recommend' style={{overflow:'hidden'}}>
      <div className='container'>
        <div id='main-text' className='a-center j-center'>
          <h1>RECOMMENDATION PLACE</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, cum, eum repellendus voluptate nobis iste enim sunt libero unde ducimus cupiditate exercitationem illo corporis quibusdam animi quaerat laboriosam porro rem!</p>
        </div>
        <div id='card-container'>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
          <div>
            <div className='recom-card'>
              <div className='dummy-img'></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nostrum quae, corrupti eos, iure ullam enim nulla saepe totam impedit possimus assumenda aliquid exercitationem. Maiores voluptatibus nulla tempore autem dolore?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
export default App
