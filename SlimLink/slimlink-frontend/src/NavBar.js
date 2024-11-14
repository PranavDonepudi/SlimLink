import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './Pages/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LogoutButton from './LogoutButton';
import logo from './IMG_6350.PNG';

function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up the onAuthStateChanged listener to update the user state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="SlimLink Logo"
            style={{ width: '150px', height: '40px', objectFit: 'contain' }}
          />
        </Link>
        
        {/* Navbar toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about-us">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/plans">
                Plans
              </Link>
            </li>
            
            {/* Conditional Rendering for Login and Logout */}
            <li className="nav-item">
              {user ? (
                <LogoutButton />
              ) : (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
