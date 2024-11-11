// In UrlShortener Component (in App.js)
// Run "npm install mdb-react-ui-kit" & "npm install @fortawesome/fontawesome-free" to implement footer

import ComplianceAndCertification from './Pages/ComplianceAndCertification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';
import BeyondSlim from './Pages/BeyondSlim';
import React, { useState } from 'react';
import Login from './Pages/Login';
import About from './Pages/About';
import Plans from './Pages/Plans';
import logo from './logo.jpeg';
import NavBar from './NavBar';
import './App.css';
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';

function UrlShortener() {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const regularexpress = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
    const ifValid =  regularexpress.test(longURL);

    if (ifValid) {
      function generateShortURL(length = 6) {
        return `https://sl.to/${[...Array(length)].map(() => Math.random().toString(36)[2]).join('')}`;
      }
      const shortenedURL = generateShortURL(6);
      setShortURL(shortenedURL);
      console.log(generateShortURL);

      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 2000);
    } else {
      setShortURL("Please Enter A Valid URL!")
    };
  };

  const scrollIncrement = 0.25; 
  const scrollToBottom = () => {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const targetScroll = currentScroll + document.documentElement.scrollHeight * scrollIncrement;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    }) 
  }

  return (
    <div className="content-container">
      <img src={logo} alt="SlimLink Logo"
      className={`logo ${isSpinning ? 'spinning' : ''}`}
      />
      <h1>SlimLink URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="urlInput" className="form-label">Enter Long URL</label>
          <input
            type="text"
            className="form-control"
            id="urlInput"
            value={longURL}
            onChange={(e) => setLongURL(e.target.value)}
            placeholder="Enter your long URL here..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Shorten URL</button>
      </form>

      {shortURL && (
        <div className="shortened-url">
          <h5>Shortened URL:</h5>
          <a href={shortURL} target="_blank" rel="noopener noreferrer">{shortURL}</a>
        </div>
      )}

      {/* Slimlink Connection Platform Section */}
      <section className="connection-platform">
        <h2>The Slimlink Connection Platform</h2>
        <p>All the products you need to build brand connections, manage links, and connect with audiences everywhere in a single unified platform.</p>
        <div className="platform-buttons">
          <button className="cta-button">Get started for free</button>
          <button className="cta-button outline">Get a quote</button>
        </div>
        <div className="platform-features">
          <div className="feature-card">
            <h3>Slimmest URLs</h3>
            <p>A comprehensive solution to help make every point of connection between your content and audience more powerful.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Analysics</h3>
            <p>QR Code solutions for every customer, business, and brand experience.</p>
          </div>
          <div className="feature-card">
            <h3>Landing Pages</h3>
            <p>Create engaging, mobile-optimized landing pages in minutes.</p>
          </div>
        </div>
      </section>

      {/*container for side-by-side layout */}
      <div className="side-by-side-container">
        <BeyondSlim />
        <ComplianceAndCertification />
      </div>

      <button className="scroll-down-button" onClick={scrollToBottom}>Scroll for More</button>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/" element={<UrlShortener />} />
        </Routes>
      </Router>

      <MDBFooter className="text-center" color="white" bgColor="dark">
        <MDBContainer className="p-4">
          <section className="mb-4">
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="twitter" />
            </MDBBtn>
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="google" />
            </MDBBtn>
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="instagram" />
            </MDBBtn>
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>
            <MDBBtn outline color="light" floating className="m-1" href="#!" role="button">
              <MDBIcon fab icon="github" />
            </MDBBtn>
          </section>

        {/* <section className="email">
            <form action="">
              <MDBRow className="d-flex justify-content-center">
                <MDBCol size="auto">
                  <p className="pt-2">
                    <strong>Sign up for our newsletter</strong>
                  </p>
                </MDBCol>
                <MDBCol md="5" start>
                  <MDBInput contrast type="email" label="Email address" className="mb-4" />
                </MDBCol>
                <MDBCol size="auto">
                  <MDBBtn outline color="light" type="submit" className="mb-4">
                    Subscribe
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </form>
          </section> 
        */}

          <section className="terms">
            <MDBRow>
              <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
                <h5 className="text-uppercase">Terms & Conditions</h5>
                <ul className="list-unstyled mb-0">
                  <li><a href="#!" className="text-white">Terms & conditions</a></li>
                  <li><a href="#!" className="text-white">Privacy policy</a></li>
                  <li><a href="#!" className="text-white">Anti spam policy</a></li>
                  {/* <li><a href="#!" className="text-white">Cookie policy</a></li> */}
                </ul>
              </MDBCol>
              
              <MDBCol lg="3" md="7" className="mb-4 mb-md-0">
                <h5 className="text-uppercase">Support</h5>
                <ul className="list-unstyled mb-0">
                  <li><a href="#!" className="text-white">Contact Us</a></li>
                  <li><a href="#!" className="text-white">Help Center</a></li>
                  <li><a href="#!" className="text-white">FAQ</a></li>
                </ul>
              </MDBCol>

              <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
                <h5 className="text-uppercase">Resources</h5>
                <ul className="list-unstyled mb-0">
                  <li><a href="#!" className="text-white">Blog</a></li>
                  <li><a href="#!" className="text-white">Guides</a></li>
                  <li><a href="#!" className="text-white">Webinars</a></li>
                </ul>
              </MDBCol>

              <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
                <h5 className="text-uppercase">Company</h5>
                <ul className="list-unstyled mb-0">
                  <li><a href="#!" className="text-white">About Us</a></li>
                  <li><a href="#!" className="text-white">Careers</a></li>
                  <li><a href="#!" className="text-white">Press</a></li>
                </ul>
              </MDBCol>
            </MDBRow>
          </section>
        {/* 
          <section className="mb-4">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum repellat quaerat
              voluptatibus placeat nam, commodi optio pariatur est quia magnam eum harum corrupti dicta, aliquam
              sequi voluptate quas.
            </p>
          </section> 
        */}

        </MDBContainer>
        <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
          © 2024 SlimLink
        </div>
      </MDBFooter>
    </>
  );
}
export default App;