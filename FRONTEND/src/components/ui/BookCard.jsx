import React from 'react';

function BookCard({ book }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="book-card border-0 shadow-sm h-100 bg-white rounded-4 overflow-hidden">
        <div className="position-relative">
          <img 
            src={book.image} 
            alt={book.titre} 
            className="book-img w-100" 
            style={{ height: '250px', objectFit: 'cover' }} 
          />
        </div>

        <div className="book-content p-3">
          <span className="book-category text-primary small fw-medium">{book.categorie}</span>
          <h5 className="book-title my-2 fw-bold text-dark">{book.titre}</h5>
          <p className="book-author text-muted small mb-3">
            <i className="fas fa-user me-1"></i>{book.auteur}
          </p>

          <div className="book-footer d-flex justify-content-between align-items-center pt-3 border-top">
            <span className="book-rating text-warning small">
              <i className="fas fa-star me-1"></i> 
              {book.rating ? book.rating.toFixed(1) : "N/A"}
            </span>
            
            <span className={book.stock > 0 ? 'badge-available' : 'badge-unavailable'}>
              {book.stock > 0 ? 'Disponible' : 'Indisponible'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
