import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getMaListe, retirerDeLaWishlist } from '../../services/wishList.api';
import { emprunter } from '../../services/emprunts.api';
import { getUserById } from '../../services/users.api';

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
];

function Wishlist() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id) {
        const u = await getUserById(storedUser.id);
        if (u) {
          setUser(u);
        }
      }
      const data = await getMaListe();
      setWishlist(data || []);
    } catch (error) {
      console.error('Erreur chargement wishlist:', error);
    }
    setIsLoading(false);
  }

  async function handleRemove(livreId) {
    setActionLoading(livreId);
    try {
      await retirerDeLaWishlist(livreId);
      await loadData();
    } catch (err) {
      console.error('Erreur suppression wishlist:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setActionLoading(null);
  }

  async function handleBorrow(livreId) {
    setActionLoading(livreId);
    try {
      await emprunter({ livreId });
      setSuccessMsg('Demande d\'emprunt envoyée avec succès !');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadData();
    } catch (err) {
      console.error('Erreur emprunt:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de l\'emprunt.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setActionLoading(null);
  }

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="wishlist"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user.nom}
        userLevel={user.niveau}
      />

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1>Liste de souhaits ❤️</h1>
                <p>Les livres que vous souhaitez lire</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => window.location.href = '/livres'}>
              <i className="fas fa-book-open"></i> Explorer la bibliothèque
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-heart"></i></div>
            </div>
            <h3>{isLoading ? '...' : wishlist.length}</h3>
            <p>Livres sauvegardés</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            </div>
            <h3>{isLoading ? '...' : wishlist.filter(w => w.livre?.stock > 0).length}</h3>
            <p>Disponibles</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-times-circle"></i></div>
            </div>
            <h3>{isLoading ? '...' : wishlist.filter(w => !w.livre?.stock || w.livre.stock === 0).length}</h3>
            <p>Indisponibles</p>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-check-circle"></i> {successMsg}
          </div>
        )}

        {/* Wishlist Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement de votre liste...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="empty-emprunts">
            <i className="fas fa-heart" style={{ display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Votre liste de souhaits est vide.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/livres'}>
              <i className="fas fa-book"></i> Découvrir des livres
            </button>
          </div>
        ) : (
          <div className="student-books-grid">
            {wishlist.map((item, index) => {
              const book = item.livre;
              if (!book) {
                return null;
              }
              return (
                <div key={item.id} className="student-book-card">
                  <div className="student-book-cover">
                    {book.image ? (
                      <img src={book.image} alt={book.titre} />
                    ) : (
                      <div className="placeholder" style={{ background: GRADIENT_COLORS[index % GRADIENT_COLORS.length] }}>
                        <i className="fas fa-book"></i>
                      </div>
                    )}
                    <span className={`student-book-status ${book.stock > 0 ? 'available' : 'unavailable'}`}>
                      {book.stock > 0 ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="student-book-info">
                    <h4>{book.titre}</h4>
                    <p className="author">{book.auteur}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {book.stock > 0 && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem', flex: 1 }}
                          onClick={() => handleBorrow(book.id)}
                          disabled={actionLoading === book.id}
                        >
                          {actionLoading === book.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <><i className="fas fa-hand-holding"></i> Emprunter</>
                          )}
                        </button>
                      )}
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        onClick={() => handleRemove(book.id)}
                        disabled={actionLoading === book.id}
                      >
                        <i className="fas fa-heart-broken"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Error Modal */}
      {errorModal.show && (
        <div className="modal-overlay active" onClick={() => setErrorModal({ show: false, message: '' })}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h2><i className="fas fa-exclamation-circle" style={{ color: '#ef4444' }}></i> Erreur</h2>
              <button className="close-modal" onClick={() => setErrorModal({ show: false, message: '' })}>&times;</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', color: '#ef4444' }}>
                <i className="fas fa-times"></i>
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#f8fafc', fontSize: '1.2rem' }}>Action impossible</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem', background: 'rgba(239, 68, 68, 0.08)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                {errorModal.message}
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', borderTop: 'none' }}>
              <button className="btn btn-outline" onClick={() => setErrorModal({ show: false, message: '' })}>
                <i className="fas fa-times"></i> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
