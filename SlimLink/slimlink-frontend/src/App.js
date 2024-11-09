// In UrlShortener Component (in App.js)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Pages/Login';
import './App.css';
import logo from './logo.jpeg';
import ComplianceAndCertification from './Pages/ComplianceAndCertification';
import BeyondSlim from './Pages/BeyondSlim';
import About from './Pages/About';
import Plans from './Pages/Plans';

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
      const shortenedURL = generateShortURL(5);
      setShortURL(shortenedURL);
      console.log(generateShortURL);

      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 2000);
    } else {
      setShortURL("Please Enter A Valid URL!")
    };
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

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
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/" element={<UrlShortener />} />
      </Routes>
    </Router>
  );
}

export default App;