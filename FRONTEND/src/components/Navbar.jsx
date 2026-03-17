import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <a className="navbar-brand" href="#home">
          <i className="fas fa-book-reader me-2"></i>Bibliothèque
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home">Accueil</a>
            </li>
           
            <li className="nav-item">
              <a className="nav-link" href="#books">Livres</a>
            </li>
            
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
          <a href="login.html" className="btn btn-primary">
            <i className="fas fa-sign-in-alt me-2"></i>Connexion
          </a>
        </div>
      </div>
    </nav>
  );
}
