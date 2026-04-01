import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getAllBooks } from '../../services/livres.api';
import { emprunter } from '../../services/emprunts.api';
import { getUserById } from '../../services/users.api';
import { getCategories } from '../../services/category.api';
import { getMaListe, ajouterALaWishlist, retirerDeLaWishlist } from '../../services/wishList.api';

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #d299c2, #fef9d7)',
  'linear-gradient(135deg, #96e6a1, #d4fc79)',
];

function StudentLivres() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [categories, setCategories] = useState(['Tous']);
  const [user, setUser] = useState({});

  // Modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showBorrowConfirm, setShowBorrowConfirm] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [wishlist, setWishlist] = useState([]);
  const [isBookInWishlist, setIsBookInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Bonus Selection
  const [selectedBonusId, setSelectedBonusId] = useState(null);

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

      const data = await getAllBooks();
      setBooks(data || []);
      setFilteredBooks(data || []);

      const wishlistData = await getMaListe();
      setWishlist(wishlistData || []);

      const categoriesData = await getCategories();
      const categoriesName=categoriesData.map(c=>c.name)
      const cats =['Tous',...categoriesName] 
      setCategories(cats);
    } catch (error) {
      console.error('Erreur chargement livres:', error);
    }
    setIsLoading(false);
  }

  // Search & Filter
  useEffect(() => {
    let result = books;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => {
        return (b.titre || '').toLowerCase().includes(q) ||
               (b.auteur || '').toLowerCase().includes(q) ||
               (b.category?.name || '').toLowerCase().includes(q);
      });
    }
    
    if (activeCategory !== 'Tous') {
      result = result.filter(b => {
        return b.category?.name === activeCategory;
      });
    }

    setFilteredBooks(result);
  }, [searchQuery, activeCategory, books]);

  // Open Book Detail
  async function openBookDetail(book) {
    setSelectedBook(book);
    const isInWishlist = wishlist.some(item => item.livre.id === book.id);
    setIsBookInWishlist(isInWishlist);
    setShowBookModal(true);
    setBorrowSuccess(false);
    setSelectedBonusId(null);
  }

  // Borrow
  async function handleBorrow() {
    if (!selectedBook) {
      return;
    }
    setBorrowLoading(true);
    try {
      await emprunter({ 
        livreId: selectedBook.id,
        bonusPossedeId: selectedBonusId || undefined 
      });
      setBorrowSuccess(true);
      setShowBorrowConfirm(false);
      await loadData();
    } catch (err) {
      console.error('Erreur emprunt:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la demande d\'emprunt.';
      setShowBorrowConfirm(false);
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setBorrowLoading(false);
  }

  // Wishlist
  async function handleToggleWishlist() {
    if (!selectedBook) return;
    setWishlistLoading(true);
    try {
      if (isBookInWishlist) {
        await retirerDeLaWishlist(selectedBook.id);
      } else {
        await ajouterALaWishlist(selectedBook.id);
      }
      // Refresh wishlist and update state
      const updatedWishlist = await getMaListe();
      setWishlist(updatedWishlist || []);
      setIsBookInWishlist(!isBookInWishlist);
    } catch (err) {
      console.error('Erreur wishlist:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour de la wishlist.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setWishlistLoading(false);
  }

  // Filter useful bonuses for borrow (only PROLONGATION available in this project)
  const availableBorrowBonuses = user.bonusPossedes?.filter(b => 
    b.recompense.type === 'PROLONGATION'
  ) || [];

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="bibliotheque"
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
                <h1>Bibliothèque 📚</h1>
                <p>Découvrez notre collection de livres</p>
              </div>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <div className="search-section">
          <h2>Que voulez-vous lire aujourd'hui ?</h2>
          <div className="search-bar-large">
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou catégorie..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="search-btn"><i className="fas fa-search"></i></button>
          </div>
          <div className="filter-tags">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tag ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-count">
            Affichage de <strong>{filteredBooks.length}</strong> livre{filteredBooks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement des livres...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '1rem', display: 'block' }}></i>
            <p>Aucun livre trouvé pour votre recherche.</p>
          </div>
        ) : (
          <div className="student-books-grid">
            {filteredBooks.map((book, index) => (
              <div key={book.id} className="student-book-card" onClick={() => openBookDetail(book)}>
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
                  <div className="student-book-meta">
                    <span className="category">{book.category?.name || 'Général'}</span>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={e => { e.stopPropagation(); openBookDetail(book); }}
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <i className="fas fa-hand-holding"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      {showBookModal && selectedBook && (
        <div className="modal-overlay active" onClick={() => setShowBookModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-book" style={{ color: '#6366f1' }}></i> Détails du livre</h2>
              <button className="close-modal" onClick={() => setShowBookModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="book-detail">
                <div className="book-detail-cover" style={{ background: selectedBook.image ? 'none' : GRADIENT_COLORS[0] }}>
                  {selectedBook.image ? (
                    <img src={selectedBook.image} alt={selectedBook.titre} />
                  ) : (
                    <i className="fas fa-book"></i>
                  )}
                </div>
                <div className="book-detail-info">
                  <h2>{selectedBook.titre}</h2>
                  <p className="author">{selectedBook.auteur}</p>
                  <div className="book-detail-meta">
                    <span className="meta-item"><i className="fas fa-layer-group"></i> {selectedBook.category?.name || 'Général'}</span>
                    {selectedBook.isbn && <span className="meta-item"><i className="fas fa-barcode"></i> {selectedBook.isbn}</span>}
                  </div>
                  {selectedBook.description && (
                    <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '1.5rem' }}>{selectedBook.description}</p>
                  )}
                  <div className={`availability-status ${selectedBook.stock > 0 ? 'available' : 'unavailable'}`}>
                    <i className={`fas ${selectedBook.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    <div>
                      <strong>{selectedBook.stock > 0 ? 'Disponible' : 'Indisponible'}</strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        {selectedBook.stock > 0 ? `${selectedBook.stock} exemplaire(s) disponible(s)` : 'Aucun exemplaire disponible'}
                      </p>
                    </div>
                  </div>

                  {borrowSuccess ? (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                      <p style={{ color: '#10b981', fontWeight: 600 }}>Demande d'emprunt envoyée avec succès !</p>
                    </div>
                  ) : (
                    <div className="book-actions-modal">
                      {selectedBook.stock > 0 && (
                        <button className="btn btn-primary" onClick={() => setShowBorrowConfirm(true)}>
                          <i className="fas fa-hand-holding"></i> Emprunter
                        </button>
                      )}
                      <button
                        className={`btn ${isBookInWishlist ? 'btn-danger' : 'btn-outline'}`}
                        onClick={handleToggleWishlist}
                        disabled={wishlistLoading}
                      >
                        {wishlistLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : isBookInWishlist ? (
                          <><i className="fas fa-heart-broken"></i> Retirer</>
                        ) : (
                          <><i className="fas fa-heart"></i> Wishlist</>
                        )}
                      </button>
                      <button className="btn btn-outline" onClick={() => setShowBookModal(false)}>
                        Fermer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borrow Confirmation Modal */}
      {showBorrowConfirm && selectedBook && (
        <div className="modal-overlay active" onClick={() => setShowBorrowConfirm(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-hand-holding" style={{ color: '#10b981' }}></i> Confirmer l'emprunt</h2>
              <button className="close-modal" onClick={() => setShowBorrowConfirm(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: '#10b981' }}>
                  <i className="fas fa-check"></i>
                </div>
                <h3 style={{ marginBottom: '0.25rem', color: '#f8fafc' }}>Confirmer la demande</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                   « {selectedBook.titre} »
                </p>
              </div>

              {/* Bonus Selection Section */}
              <div className="bonus-selection-borrow">
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 500 }}>
                  <i className="fas fa-gift" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i> Appliquer un bonus (optionnel) :
                </label>
                
                {availableBorrowBonuses.length === 0 ? (
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                    Aucun bonus éligible dans votre inventaire.
                  </div>
                ) : (
                  <div className="bonus-mini-list" style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div 
                      className={`bonus-mini-item ${selectedBonusId === null ? 'selected' : ''}`}
                      onClick={() => setSelectedBonusId(null)}
                      style={{
                        padding: '0.6rem 0.8rem', borderRadius: '10px', background: selectedBonusId === null ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedBonusId === null ? '#6366f1' : 'transparent'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s'
                      }}
                    >
                      <i className="fas fa-times-circle" style={{ color: '#94a3b8' }}></i>
                      <span style={{ fontSize: '0.85rem', color: selectedBonusId === null ? '#f8fafc' : '#94a3b8' }}>Aucun bonus</span>
                    </div>

                    {availableBorrowBonuses.map(bonus => {
                      const isSelected = selectedBonusId === bonus.id;
                      let icon = 'fa-gift';
                      let color = '#f59e0b';
                      let desc = '';

                      if (bonus.recompense.type === 'PROLONGATION') { icon = 'fa-hourglass-start'; color = '#3b82f6'; desc = '+7 jours extra'; }
                      else if (bonus.recompense.type === 'PREMIUM') { icon = 'fa-crown'; color = '#f59e0b'; desc = 'Limite 5 livres'; }
                      else if (bonus.recompense.type === 'BONUS') { icon = 'fa-plus-circle'; color = '#10b981'; desc = '+1 livre en plus'; }

                      return (
                        <div 
                          key={bonus.id}
                          className={`bonus-mini-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedBonusId(bonus.id)}
                          style={{
                            padding: '0.6rem 0.8rem', borderRadius: '10px', background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isSelected ? '#10b981' : 'transparent'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s'
                          }}
                        >
                          <i className={`fas ${icon}`} style={{ color: color }}></i>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>{bonus.recompense.nom}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{desc}</div>
                          </div>
                          {isSelected && <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '0.75rem', borderRadius: '10px', marginTop: '1.5rem', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'center' }}>
                  <i className="fas fa-info-circle" style={{ color: '#6366f1', marginRight: '0.5rem' }}></i> 
                  Durée standard : <strong>7 jours</strong> {selectedBonusId && availableBorrowBonuses.find(b => b.id === selectedBonusId)?.recompense.type === 'PROLONGATION' ? <span style={{ color: '#10b981' }}>(+7j bonus)</span> : ''}
                </p>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setShowBorrowConfirm(false)}>Annuler</button>
              <button className="btn btn-success" onClick={handleBorrow} disabled={borrowLoading}>
                {borrowLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Confirmer l'emprunt</>}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default StudentLivres;
