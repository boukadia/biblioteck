import React, { useState } from 'react';
import { deleteBook } from '../../../services/livres.api';

function DeleteConfirmModal({ show, book, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await deleteBook(book.id);
      onConfirm(book.id);
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Une erreur est survenue lors de la suppression";
      setError(errorMsg);
      setLoading(false);
    }
  };

  if (!show || !book) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-trash"></i> Supprimer le livre
          </h2>
          <button className="close-modal" onClick={onClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {error ? (
            <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: '1rem' }}>
                Êtes-vous sûr de vouloir supprimer ce livre ?
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <p style={{ margin: '0.5rem 0', color: 'var(--light)' }}>
                  <strong>{book.titre}</strong>
                </p>
                <p style={{ margin: '0.5rem 0', color: 'var(--gray)', fontSize: '0.9rem' }}>
                  par {book.auteur}
                </p>
                <p style={{ margin: '0.5rem 0', color: 'var(--gray)', fontSize: '0.85rem' }}>
                  Stock: {book.stock} copie{book.stock !== 1 ? 's' : ''}
                </p>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                Cette action ne peut pas être annulée.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onClose} 
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Suppression...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i> Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
