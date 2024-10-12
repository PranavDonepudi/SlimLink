import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar'; // Assuming NavBar.js exists in the same directory
import Login from './Pages/Login'; // Import the Login page
import './App.css'; // Assuming you have some custom styles
import logo from './logo.jpeg'; // Import the logo image
import ComplianceAndCertification from './Pages/ComplianceAndCertification'; // Import Compliance section
import BeyondSlim from './Pages/BeyondSlim'; // Import BeyondSlim section


function UrlShortener() {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [isSpinning, setIsSpinning] = useState(false); // State to control logo spinning

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const regularexpress = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
    const ifValid =  regularexpress.test(longURL);

    if (ifValid) {
      const generatedShortURL = `https://sl.to/${Math.random().toString(36).substring(7)}`;
      setShortURL(generatedShortURL);

      // Start logo spinning
      setIsSpinning(true);

      // Stop spinning after 2 seconds
      setTimeout(() => setIsSpinning(false), 2000);
    } else {
      setShortURL("Please Enter A Valid URL!")
    };
  };

  // Scroll to the bottom of the page
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="content-container">
      <img src={logo} alt="SlimLink Logo"
      className={`logo ${isSpinning ? 'spinning' : ''}`} // Apply 'spinning' class based on state
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

      {/* Including BeyondSlim & ComplianceAndCertification sections */}
      <div className="additional-info">
        <BeyondSlim/>
        <ComplianceAndCertification/>
      </div>

      {/* Scroll Down Button */}
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
        <Route path="/" element={<UrlShortener />} />
      </Routes>
    </Router>
  );
}

export default App;
