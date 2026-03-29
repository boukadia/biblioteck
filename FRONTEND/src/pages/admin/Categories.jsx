import React, { useState, useEffect } from 'react';
import '../../styles/dashboardAdmin.css';
import '../../styles/categories.css';
import StatsCard from '../../components/dashboard/admin/StatsCard';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/category.api';
import { getAdminStats } from '../../services/stats.api';
import { getAllBooks } from '../../services/livres.api';
import { getAllEmprunts } from '../../services/emprunts.api';

function Categories() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States pour la gestion (Ajout/Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, id: null, name: '', error: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  async function fetchStats() {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function fetchCategoriesWithDetails() {
    try {
      const catsData = await getCategories();
      const booksData = await getAllBooks();
      const empruntsData = await getAllEmprunts();

      const enrichedCategories = (catsData || []).map(cat => {
        const booksInCat = (booksData || []).filter(b => b.categoryId === cat.id);
        const bookIdsInCat = booksInCat.map(b => b.id);
        const empruntsInCat = (empruntsData || []).filter(e => bookIdsInCat.includes(e.livreId));

        return {
          ...cat,
          booksCount: booksInCat.length,
          empruntsCount: empruntsInCat.length
        };
      });

      setCategories(enrichedCategories);
      setFilteredCategories(enrichedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function loadAllData() {
    setIsLoading(true);
    try {
      await fetchStats();
      await fetchCategoriesWithDetails();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const filtered = categories.filter(cat => 
      (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const refreshData = async () => {
    await loadAllData();
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: '', description: '' });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setIsEditing(true);
    setCurrentCategory({ id: cat.id, name: cat.name, description: cat.description || '' });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (isEditing) {
        await updateCategory(currentCategory.id, { 
          name: currentCategory.name, 
          description: currentCategory.description 
        });
      } else {
        await createCategory({ 
          name: currentCategory.name, 
          description: currentCategory.description 
        });
      }
      setMessage({ type: 'success', text: isEditing ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès' });
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
      await refreshData();
    } catch (error) {
      console.error('Error saving category:', error);
      setMessage({ type: 'danger', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(showDeleteConfirm.id);
      setShowDeleteConfirm({ show: false, id: null, name: '', error: null });
      await refreshData();
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || 'Erreur: Cette catégorie est peut-être utilisée par des livres.';
      setShowDeleteConfirm(prev => ({ ...prev, error: errorMessage }));
    }
  };

  return (
    <div className="app-wrapper categories-page">
      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="categories" />

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="icon-btn d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: sidebarOpen ? 'none' : undefined }}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-title">
              <h1>Gestion des Catégories 🏷️</h1>
              <p>Organisez vos livres par thématiques</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <i className="fas fa-plus"></i> Nouvelle Catégorie
            </button>
          </div>
        </header>


        <div className="section-card">
          <div className="section-header">
            <h3><i className="fas fa-tags" style={{ color: '#6366f1' }}></i> Liste des Catégories</h3>
          </div>

          {isLoading ? (
            <div className="cat-empty-state"><i className="fas fa-spinner fa-spin"></i><p>Chargement...</p></div>
          ) : filteredCategories.length === 0 ? (
            <div className="cat-empty-state">
              <i className="fas fa-tag"></i>
              <p>{searchQuery ? 'Aucune catégorie ne correspond à votre recherche' : 'Aucune catégorie trouvée'}</p>
            </div>
          ) : (
            <div className="categories-list">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="category-item">
                  <div className="category-item-body">
                    <div className="category-info">
                        <div className="category-avatar">
                            {cat.name?.substring(0, 1).toUpperCase() || '?'}
                        </div>
                        <div>
                          <h5 className="category-name">{cat.name || 'Sans nom'}</h5>
                          <p className="category-desc">{cat.description || 'Pas de description'}</p>
                        </div>
                    </div>
                    
                    <div className="category-meta" style={{ display: 'flex', gap: '2rem', flex: 1, justifyContent: 'center' }}>
                      <div className="meta-item" style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{cat.booksCount || 0}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Livres</span>
                      </div>
                      <div className="meta-item" style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>{cat.empruntsCount || 0}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Emprunts</span>
                      </div>
                    </div>

                    <div className="category-actions">
                        <button className="action-btn edit" onClick={() => handleOpenEdit(cat)} title="Modifier">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" onClick={() => setShowDeleteConfirm({ show: true, id: cat.id, name: cat.name })} title="Supprimer">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Ajout / Edit — même style que AddBookModal */}
      {showModal && (
        <div className="modal-overlay active" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>
                <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus-circle'}`}></i>
                {isEditing ? ' Modifier la catégorie' : ' Nouvelle catégorie'}
              </h2>
              <button className="close-modal" onClick={handleCloseModal} disabled={loading}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {message.text && (
              <div
                className={`alert alert-${message.type} alert-custom`}
                role="alert"
                style={{ margin: '1rem' }}
              >
                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom de la catégorie</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Informatique, Roman..."
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    placeholder="Description de la catégorie..."
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal} disabled={loading}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression — même style */}
      {showDeleteConfirm.show && (
        <div className="modal-overlay active" onClick={() => setShowDeleteConfirm({ show: false, id: null, name: '', error: null })}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger)' }}></i> Confirmation
              </h2>
              <button className="close-modal" onClick={() => setShowDeleteConfirm({ show: false, id: null, name: '', error: null })}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              {showDeleteConfirm.error ? (
                <div className="alert alert-danger">
                  {showDeleteConfirm.error}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1rem' }}>
                    <i className="fas fa-trash-alt"></i>
                  </div>
                  <p style={{ color: 'var(--light)', fontSize: '1rem', margin: '0.5rem 0' }}>
                    Voulez-vous vraiment supprimer <strong>"{showDeleteConfirm.name}"</strong> ?
                  </p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                    Cette action est irréversible.
                  </p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm({ show: false, id: null, name: '', error: null })}>
                Annuler
              </button>
              {!showDeleteConfirm.error && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  <i className="fas fa-trash"></i> Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;