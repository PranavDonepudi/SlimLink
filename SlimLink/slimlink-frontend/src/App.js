import React, { useState } from 'react';
import NavBar from './NavBar'; // Assuming NavBar.js exists in the same directory
import './App.css'; // Assuming you have some custom styles if needed
import logo from './logo.jpeg'; // Import the logo image

function App() {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (longURL) {
      const generatedShortURL = `https://sl.to/${Math.random().toString(36).substring(7)}`;
      setShortURL(generatedShortURL);
    }
  };

  return (
    <>
      <NavBar /> {/* NavBar will stretch across the screen */}
      <div className="content-container">
        {/* Insert the logo image above the heading */}
        <img src={logo} alt="SlimLink Logo" className="logo" />

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
      </div>
    </>
  );
}

export default App;
