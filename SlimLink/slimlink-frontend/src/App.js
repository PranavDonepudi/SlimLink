import React, { useState } from 'react';
import './App.css';  // Import the CSS file
import logo from './logo.jpeg';

function App() {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (longURL) {
      const generatedShortURL = `https://sl.link/${Math.random().toString(36).substring(7)}`;
      setShortURL(generatedShortURL);
    }
  };

  return (
    <div className="container">
      <h1>
        <img src={logo} alt="SlimLink Logo" className="logo" /> SlimLink URL Shortener
      </h1>
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
        <button type="submit" className="btn w-100">Shorten URL</button>
      </form>
      
      {shortURL && (
        <div className="shortened-url">
          <h5>Shortened URL:</h5>
          <a href={shortURL} target="_blank" rel="noopener noreferrer">{shortURL}</a>
        </div>
      )}
    </div>
  );
}

export default App;
