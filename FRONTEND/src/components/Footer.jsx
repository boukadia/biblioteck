import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <a href="#home" className="footer-brand">
              <i className="fas fa-book-reader me-2"></i>Bibliothèque
            </a>
            <p className="footer-text">
              Votre destination pour la connaissance et la découverte.
              Explorez notre collection et rejoignez notre communauté.
            </p>
            <div className="footer-social">
              <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#twitter"><i className="fab fa-twitter"></i></a>
              <a href="#instagram"><i className="fab fa-instagram"></i></a>
              <a href="#linkedin"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Liens</h5>
            <ul className="footer-links">
              <li><a href="#home">Accueil</a></li>
              <li><a href="#categories">Catégories</a></li>
              <li><a href="#books">Livres</a></li>
              <li><a href="#features">Services</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title">Catégories</h5>
            <ul className="footer-links">
              <li><a href="#romans">Romans</a></li>
              <li><a href="#sciences">Sciences</a></li>
              <li><a href="#histoire">Histoire</a></li>
              <li><a href="#technologie">Technologie</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5 className="footer-title">Contact</h5>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt me-2"></i>123 Avenue de la Lecture, Paris</li>
              <li><i className="fas fa-phone me-2"></i>+33 1 23 45 67 89</li>
              <li><i className="fas fa-envelope me-2"></i>contact@bibliotheque.fr</li>
              <li><i className="fas fa-clock me-2"></i>Lun - Sam: 9h - 20h</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Bibliothèque du Savoir. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
