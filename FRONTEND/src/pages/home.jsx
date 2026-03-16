import React from 'react';
import '../styles/home.css';
import BookCard from '../components/ui/BookCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
      <Navbar />
      
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
              <a  className="btn btn-outline-dark btn-lg">
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

      <Footer />
    </div>
  );
}
