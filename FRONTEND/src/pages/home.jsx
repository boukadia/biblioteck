import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import BookCard from '../components/ui/BookCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';
import {getAllBooks} from '../services/books.api'
import { getLeaderboard } from '../services/users.api';





export default function Home() {
  const [booksData,setBooksData]=useState([])
  const [topStudents, setTopStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(
    function() {
      async function loadAllData() {
        try {
          const booksData = await getAllBooks(); 
          setBooksData(booksData);
        } catch (err) {
          console.error("error du l-API books:", err);
          setError(err.message || JSON.stringify(err));
        }

        try {
          const leaderboardData = await getLeaderboard();
          setTopStudents(leaderboardData);
        } catch (err) {
          console.error("error du l-API leaderboard:", err);
          setError(err.message || JSON.stringify(err));
        }
        
        setIsLoading(false);
      }
      loadAllData();
    }, 
  []);

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
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

      {/* Leaderboard Section */}
      {isLoading && (
        <section className="leaderboard-section" id="leaderboard">
          <div className="section-header">
            <h2>🏆 <span>Classement des Lecteurs</span></h2>
          </div>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des données en cours...</p>
          </div>
        </section>
      )}
      {!isLoading && <Leaderboard students={topStudents} />}

      <Footer />
    </div>
  );
}
