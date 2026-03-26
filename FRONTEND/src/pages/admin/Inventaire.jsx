import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/inventaire.css';
import { getAllBooks, changeBookStock } from '../../services/livres.api';
import { getAllEmprunts } from '../../services/emprunts.api';

function Inventaire() {
  const [activePage, setActivePage] = useState('inventaire');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal Actions
  const [showAddStockModal, setShowAddStockModal] = useState({ show: false, selectedBookId: '' });
  const [stockAddQuantity, setStockAddQuantity] = useState(1);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const booksData = await getAllBooks();
      const empruntsData = await getAllEmprunts();

      // Get unique categories for the filter
      const cats = Array.from(new Set(booksData.map(b => b.category?.name).filter(Boolean)));
      setCategories(cats);

      // Map books to calculate available and borrowed copies
      const enrichedBooks = booksData.map(book => {
        const emprunteCount = empruntsData.filter(e => 
          e.livreId === book.id && ['EN_COURS', 'EN_RETARD', 'EN_ATTENTE_RETOUR'].includes(e.statut)
        ).length;

        const disponibleCount = book.stock - emprunteCount;
        
        const stockStatus = disponibleCount <= 0 ? 'out' : (disponibleCount < 3 ? 'low' : 'good');

        return { ...book, emprunte: emprunteCount, disponible: disponibleCount, stockStatus };
      });

      setBooks(enrichedBooks);
      setFilteredBooks(enrichedBooks);
    } catch (error) {
      console.error('Erreur chargement inventaire:', error);
    }
    setIsLoading(false);
  }

  // --- Filtrage ---
  useEffect(() => {
    let result = books;
    if (statusFilter) {
      result = result.filter(b => b.stockStatus === statusFilter);
    }
    if (categoryFilter) {
      result = result.filter(b => b.category?.name === categoryFilter);
    }
    setFilteredBooks(result);
  }, [statusFilter, categoryFilter, books]);

  // --- Add Stock Action ---
  async function handleAddStock(e) {
    e.preventDefault();
    setStockError('');
    
    if (!showAddStockModal.selectedBookId) {
      setStockError('Veuillez sélectionner un livre.');
      return;
    }

    if (stockAddQuantity < 1) {
      setStockError('La quantité doit être supérieure à 0.');
      return;
    }

    setStockLoading(true);
    try {
      await changeBookStock(showAddStockModal.selectedBookId, stockAddQuantity);
      // Reload Data
      await loadData();
      setShowAddStockModal({ show: false, selectedBookId: '' });
      setStockAddQuantity(1);
    } catch (err) {
      console.error(err);
      setStockError('Erreur lors de l\'ajout du stock.');
    }
    setStockLoading(false);
  }

  // --- Stats pour les alertes ---
  const ruptures = books.filter(b => b.stockStatus === 'out').length;
  const faibles = books.filter(b => b.stockStatus === 'low').length;
  // Forte demande: livres dont le ratio emprunt/stock est très élevé
  const forteDemande = books.filter(b => b.stock > 0 && (b.emprunte / b.stock) > 0.7).length;

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1>Inventaire 📦</h1>
                <p>Suivre le stock de livres et les alertes</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline">
              <i className="fas fa-download"></i> Exporter
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddStockModal({ show: true, selectedBookId: '' })}>
              <i className="fas fa-plus"></i> Ajouter Stock
            </button>
          </div>
        </header>

        {/* Inventory Alerts */}
        <div className="inventory-alerts">
          <div className="inventory-alert danger">
            <div className="icon"><i className="fas fa-exclamation-circle"></i></div>
            <div class="content">
              <h4>Rupture de Stock</h4>
              <p>Livres complètement épuisés</p>
            </div>
            <div className="count">{isLoading ? '-' : ruptures}</div>
          </div>
          <div className="inventory-alert warning">
            <div className="icon"><i className="fas fa-exclamation-triangle"></i></div>
            <div class="content">
              <h4>Stock Faible</h4>
              <p>Livres avec moins de 3 exemplaires disponibles</p>
            </div>
            <div className="count">{isLoading ? '-' : faibles}</div>
          </div>
          <div className="inventory-alert info">
            <div className="icon"><i class="fas fa-info-circle"></i></div>
            <div class="content">
              <h4>Forte Demande</h4>
              <p>Livres très demandés actuellement</p>
            </div>
            <div class="count">{isLoading ? '-' : forteDemande}</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="section-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}><i className="fas fa-boxes" style={{ color: 'var(--secondary)', marginRight: '0.5rem' }}></i> État du Stock</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="filter-select" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'var(--dark)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '8px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Tous les états</option>
                <option value="out">Rupture</option>
                <option value="low">Stock faible</option>
                <option value="good">Bon stock</option>
              </select>
              <select className="filter-select" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'var(--dark)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '8px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">Toutes les catégories</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
                <p style={{ marginTop: '1rem' }}>Chargement de l'inventaire...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                <i className="fas fa-box-open" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                <p style={{ marginTop: '1rem' }}>Aucun livre trouvé dans l'inventaire.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Livre</th>
                    <th>Catégorie</th>
                    <th>Total</th>
                    <th>Disponible</th>
                    <th>Emprunté</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => {
                    const pct = book.stock > 0 ? ((book.disponible / book.stock) * 100).toFixed(0) : 0;
                    
                    let rowBg = '';
                    if (book.stockStatus === 'out') rowBg = 'rgba(239, 68, 68, 0.05)';
                    
                    let indicatorCss = 'medium';
                    let textMsg = `${pct}%`;
                    if (book.stockStatus === 'out') { indicatorCss = 'low'; textMsg = 'Épuisé'; }
                    else if (book.stockStatus === 'low') { indicatorCss = 'low'; }
                    else if (pct >= 60) { indicatorCss = 'high'; }

                    return (
                      <tr key={book.id} style={{ background: rowBg }}>
                        <td>
                          <div className="book-cell">
                            <div className="book-cover-sm" style={{ backgroundImage: `url(${book.image})` }}></div>
                            <div className="book-details">
                              <h5>{book.titre}</h5>
                              <span>{book.auteur}</span>
                            </div>
                          </div>
                        </td>
                        <td>{book.category?.name || '-'}</td>
                        <td>{book.stock}</td>
                        <td>{book.disponible}</td>
                        <td>{book.emprunte}</td>
                        <td>
                          <div className="stock-indicator">
                            <div className="stock-bar">
                              <div className={`fill ${indicatorCss}`} style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className={`stock-text ${indicatorCss}`}>{textMsg}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-sm btn-outline" title="Ajouter du stock" onClick={() => setShowAddStockModal({ show: true, selectedBookId: book.id })}>
                              <i className="fas fa-plus"></i>
                            </button>
                            <button className="btn btn-sm btn-outline" title="Historique (Bientôt disponible)">
                              <i className="fas fa-history"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal Ajout Stock */}
      {showAddStockModal.show && (
        <div className="modal-overlay active" onClick={() => setShowAddStockModal({ show: false, selectedBookId: '' })}>
          <div className="modal-dialog sm" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}><i className="fas fa-plus-circle" style={{ color: 'var(--accent)' }}></i> Ajouter Stock</h2>
              <button className="close-modal" onClick={() => setShowAddStockModal({ show: false, selectedBookId: '' })}>&times;</button>
            </div>
            <div className="modal-body">
              {stockError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.85rem' }}>{stockError}</div>}
              <form onSubmit={handleAddStock}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray)' }}>Livre</label>
                  <select 
                    value={showAddStockModal.selectedBookId}
                    onChange={(e) => setShowAddStockModal({ ...showAddStockModal, selectedBookId: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="">Choisir un livre</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.titre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray)' }}>Nombre de nouvelles copies</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={stockAddQuantity}
                    onChange={e => setStockAddQuantity(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray)' }}>Remarques (Optionnel)</label>
                  <textarea 
                    placeholder="Détails supplémentaires..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px', fontFamily: 'inherit' }}
                  ></textarea>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: 0 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddStockModal({ show: false, selectedBookId: '' })}>Annuler</button>
                  <button type="submit" className="btn btn-success" disabled={stockLoading}>
                    {stockLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-plus"></i> Ajouter</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventaire;
