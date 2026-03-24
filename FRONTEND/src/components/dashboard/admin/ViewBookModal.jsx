import React from 'react';

function ViewBookModal({ show, book, onClose }) {
  if (!show || !book) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-book"></i> Détails du livre
          </h2>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
            {/* Book Cover */}
            <div>
              {book.image ? (
                <img 
                  src={book.image} 
                  alt={book.titre} 
                  style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '280px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  fontSize: '3rem',
                  color: 'rgba(255,255,255,0.3)'
                }}>
                  <i className="fas fa-book"></i>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{book.titre}</h3>
              <p style={{ color: 'var(--gray)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                {book.auteur}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '120px', color: 'var(--gray)' }}>ISBN:</span>
                  <span style={{ flex: 1 }}>{book.isbn || '-'}</span>
                </div>

                <div style={{ display: 'flex', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '120px', color: 'var(--gray)' }}>Catégorie:</span>
                  <span style={{ flex: 1 }}>{book.category?.name || '-'}</span>
                </div>

                <div style={{ display: 'flex', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '120px', color: 'var(--gray)' }}>Stock:</span>
                  <span style={{ 
                    flex: 1,
                    color: book.stock > 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {book.stock} copie{book.stock !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', padding: '0.75rem 0' }}>
                  <span style={{ width: '120px', color: 'var(--gray)' }}>Statut:</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: book.stock > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    color: book.stock > 0 ? '#10b981' : '#ef4444'
                  }}>
                    {book.stock > 0 ? 'Disponible' : 'Non disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewBookModal;
