import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import DashboardHeader from '../../components/dashboard/admin/DashboardHeader';
import AddBookModal from '../../components/dashboard/admin/AddBookModal';
import EditBookModal from '../../components/dashboard/admin/EditBookModal';
import ViewBookModal from '../../components/dashboard/admin/ViewBookModal';
import DeleteConfirmModal from '../../components/dashboard/admin/DeleteConfirmModal';
import '../../styles/dashboardAdmin.css';
import '../../styles/livres.css';
import { getAllBooks } from '../../services/livres.api';
import { getCategories } from '../../services/category.api';

function Livres() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('books');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Load books and categories
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Handle book actions
  const handleAddBook = (newBook) => {
    setBooks([...books, newBook]);
    setShowAddModal(false);
  };

  const handleEditBook = (updatedBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setShowEditModal(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = async (bookId) => {
    setBooks(books.filter(b => b.id !== bookId));
    setShowDeleteModal(false);
    setSelectedBook(null);
  };

  const openViewModal = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.auteur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || book.categoryId === parseInt(filterCategory);
    
    let matchesStatus = true;
    if (filterStatus === 'available') {
      matchesStatus = book.stock > 0;
    } else if (filterStatus === 'borrowed') {
      matchesStatus = book.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get category name
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || 'Non catégorisé';
  };

  // Get book status
  const getBookStatus = (stock) => {
    if (stock === 0) return { label: 'Non disponible', color: 'unavailable' };
    if (stock < 3) return { label: 'Stock faible', color: 'borrowed' };
    return { label: 'Disponible', color: 'available' };
  };

  return (
    <div className="app-wrapper">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <DashboardHeader
          onAddBook={() => setShowAddModal(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Stats Grid */}
        <div className="stats-grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-book"></i></div>
            </div>
            <h3>{books.length}</h3>
            <p>Livres totaux</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            </div>
            <h3>{books.filter(b => b.stock > 0).length}</h3>
            <p>Disponibles</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-hand-holding"></i></div>
            </div>
            <h3>{books.filter(b => b.stock === 0).length}</h3>
            <p>Emprunté(s)</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-exclamation-circle"></i></div>
            </div>
            <h3>{books.filter(b => b.stock > 0 && b.stock < 3).length}</h3>
            <p>Stock faible</p>
          </div>
        </div>

        {/* Books Section */}
        <div className="card" style={{ marginTop: '2rem' }}>
          {/* Header with filters and view toggle */}
          <div className="books-header">
            <div className="books-filters">
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-filter"
              />
              <select 
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="borrowed">Non disponible</option>
              </select>
            </div>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>

            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-plus"></i> Ajouter un livre
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des livres...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-book"></i>
              <p>Aucun livre trouvé</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="books-grid">
                  {filteredBooks.map(book => {
                    const status = getBookStatus(book.stock);
                    return (
                      <div key={book.id} className="book-card">
                        <div className="book-cover">
                          {book.image ? (
                            <img src={book.image} alt={book.titre} />
                          ) : (
                            <div className="book-placeholder">
                              <i className="fas fa-book"></i>
                            </div>
                          )}
                          <span className={`book-status-badge ${status.color}`}>
                            {status.label}
                          </span>
                          <div className="book-actions-overlay">
                            <button 
                              className="action-btn view-btn"
                              onClick={() => openViewModal(book)}
                              title="Voir les détails"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => openEditModal(book)}
                              title="Modifier"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => openDeleteModal(book)}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="book-info">
                          <h4>{book.titre}</h4>
                          <p className="author">{book.auteur}</p>
                          <div className="book-meta">
                            <span className="category">{getCategoryName(book.categoryId)}</span>
                            <span className="copies">
                              <i className="fas fa-copy"></i> {book.stock} copie{book.stock !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="books-table-wrapper">
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>ISBN</th>
                        <th>Catégorie</th>
                        <th>Stock</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map(book => {
                        const status = getBookStatus(book.stock);
                        return (
                          <tr key={book.id}>
                            <td className="title-cell">{book.titre}</td>
                            <td>{book.auteur}</td>
                            <td className="isbn-cell">{book.isbn || '-'}</td>
                            <td>{getCategoryName(book.categoryId)}</td>
                            <td className="stock-cell">{book.stock}</td>
                            <td>
                              <span className={`status-badge ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button 
                                className="action-icon view"
                                onClick={() => openViewModal(book)}
                                title="Voir"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="action-icon edit"
                                onClick={() => openEditModal(book)}
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="action-icon delete"
                                onClick={() => openDeleteModal(book)}
                                title="Supprimer"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Stats */}
              <div className="books-stats">
                <div className="stat-item">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{filteredBooks.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Disponibles:</span>
                  <span className="stat-value">{filteredBooks.filter(b => b.stock > 0).length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Non disponibles:</span>
                  <span className="stat-value">{filteredBooks.filter(b => b.stock === 0).length}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddBookModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddBook}
      />

      {selectedBook && (
        <>
          <EditBookModal
            show={showEditModal}
            book={selectedBook}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleEditBook}
          />
          <ViewBookModal
            show={showViewModal}
            book={selectedBook}
            onClose={() => setShowViewModal(false)}
          />
          <DeleteConfirmModal
            show={showDeleteModal}
            book={selectedBook}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteBook}
          />
        </>
      )}
    </div>
  );
}

export default Livres;
