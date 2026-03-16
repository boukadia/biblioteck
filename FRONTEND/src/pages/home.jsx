import React from 'react';
import '../styles/home.css';
import BookCard from '../components/ui/BookCard';

// Données des livres
const booksData = [
  {
    id: 1,
    titre: 'Le Petit Prince',
    auteur: 'Antoine de Saint-Exupéry',
    categorie: 'Roman',
    rating: 4.8,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
  },
  {
    id: 2,
    titre: 'Une brève histoire du temps',
    auteur: 'Stephen Hawking',
    categorie: 'Science',
    rating: 5.0,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
  },
  {
    id: 3,
    titre: "L'Étranger",
    auteur: 'Albert Camus',
    categorie: 'Philosophie',
    rating: 4.5,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  },
  {
    id: 4,
    titre: 'Clean Code',
    auteur: 'Robert C. Martin',
    categorie: 'Technologie',
    rating: 4.7,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
  },
  {
    id: 5,
    titre: 'Sapiens',
    auteur: 'Yuval Noah Harari',
    categorie: 'Histoire',
    rating: 4.9,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
  },
  {
    id: 6,
    titre: 'Thinking, Fast and Slow',
    auteur: 'Daniel Kahneman',
    categorie: 'Psychologie',
    rating: 4.6,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  },
  {
    id: 7,
    titre: '1984',
    auteur: 'George Orwell',
    categorie: 'Roman',
    rating: 4.8,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
  },
  {
    id: 8,
    titre: 'Cosmos',
    auteur: 'Carl Sagan',
    categorie: 'Science',
    rating: 4.9,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  },
];

export default function Home() {
  return (
    <div>
      {/* Navbar */}
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
                <a className="nav-link" href="#categories">Catégories</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#books">Livres</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Services</a>
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

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1>
                Bienvenue à la <span>Bibliothèque</span> du Savoir
              </h1>
              <p>
                Explorez notre vaste collection de livres couvrant tous les domaines.
                Plus de 10 000 livres vous attendent pour enrichir vos connaissances.
              </p>
              <a href="#books" className="btn btn-primary btn-lg me-2">
                <i className="fas fa-book me-2"></i>Explorer
              </a>
              <a href="register.html" className="btn btn-outline-dark btn-lg">
                <i className="fas fa-user-plus me-2"></i>S'inscrire
              </a>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2702/2702134.png"
                alt="Bibliothèque"
                className="hero-img"
                style={{ maxWidth: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Box */}
      <div className="container">
        <div className="search-box">
          <form className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Titre du livre..." />
            </div>
            <div className="col-md-3">
              <select className="form-control">
                <option value="">Toutes les catégories</option>
                <option value="romans">Romans</option>
                <option value="sciences">Sciences</option>
                <option value="histoire">Histoire</option>
                <option value="technologie">Technologie</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Auteur..." />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <i className="fas fa-search me-2"></i>Rechercher
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Books Section */}
      <section className="books py-5" id="books">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="fw-bold">Livres populaires</h2>
            <p className="text-muted">Les livres les plus empruntés par nos membres</p>
          </div>

          <div className="row g-4">
            {booksData.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="text-center mt-5">
            <button className="btn btn-primary btn-lg px-5 shadow">
              Voir tous les livres <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
