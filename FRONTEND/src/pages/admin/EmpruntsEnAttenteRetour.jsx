import React, { useState, useEffect } from 'react';
import '../../styles/adminEmprunts.css';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { getEmpruntsEnAttenteRetour, retournerLivre } from '../../services/emprunts.api.js';
import { getAdminStats } from '../../services/stats.api';

function EmpruntsEnAttenteRetour() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empruntsEnAttenteRetour, setEmpruntsEnAttenteRetour] = useState([]);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
    userName: '',
    bookTitle: ''
  });

  useEffect(() => {
    async function getStats() {
      try {
        const statsData = await getAdminStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getStats();

    async function loadEmpruntsAttenteRetour() {
      try {
        const data = await getEmpruntsEnAttenteRetour();
        setEmpruntsEnAttenteRetour(data || []);
      } catch (error) {
        console.error('Error loading loans waiting return:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEmpruntsAttenteRetour();
  }, []);

  const refreshData = async () => {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
      const data = await getEmpruntsEnAttenteRetour();
      setEmpruntsEnAttenteRetour(data || []);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleReturn = async () => {
    try {
      await retournerLivre(confirmModal.id);
      await refreshData();
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setConfirmModal({ show: false, id: null, userName: '', bookTitle: '' });
    }
  };

  return (
    <div className="loan-requests-page">
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage="pending-return-loans"
      />

      <main className="main-content">
        <header className="header">
          <div className="d-flex align-items-center gap-3">
            <button
              className="mobile-menu-btn d-lg-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-title">
              <h1>Emprunts en Attente de Retour 📥</h1>
              <p>Valider les retours déclarés par les étudiants</p>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
              <i className="fas fa-clock" style={{ color: 'var(--primary)' }}></i>
            </div>
            <div className="stat-info">
              <p>Retours en Attente</p>
              <span>{isLoading ? '...' : empruntsEnAttenteRetour.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
            </div>
            <div className="stat-info">
              <p>Total des Retards</p>
              <span>{isLoading ? '...' : stats.empruntsEnRetard ?? '0'}</span>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-clipboard-check" style={{ color: '#4f46e5' }}></i>
              {' '}Retours à Valider
            </h3>
          </div>

          {isLoading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Chargement...</p>
            </div>
          ) : empruntsEnAttenteRetour.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              <p>Aucun retour en attente pour le moment</p>
            </div>
          ) : (
            empruntsEnAttenteRetour.map((emprunt) => {
              const user = emprunt.utilisateur;
              const book = emprunt.livre;
              const userInitials = user?.initials || user?.nom?.substring(0, 2).toUpperCase() || '??';
              const userName = user?.nom || 'Utilisateur inconnu';
              const bookTitle = book?.titre || 'Sans titre';

              const dateDeclaration = emprunt.dateRetour ? new Date(emprunt.dateRetour) : null;

              return (
                <div key={emprunt.id} className="request-card">
                  <div className="request-body">
                    <div className="request-user">
                      <div className="user-avatar-sm">{userInitials}</div>
                      <div>
                        <h5>{userName}</h5>
                        <div className="user-level">
                          Retour déclaré
                        </div>
                      </div>
                    </div>

                    <div className="request-book">
                      <div className="book-cover-sm"></div>
                      <div>
                        <h5>{bookTitle}</h5>
                        <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                          {dateDeclaration
                            ? `Déclaré le: ${dateDeclaration.toLocaleDateString('fr-FR')}`
                            : 'Date de déclaration indisponible'}
                        </span>
                      </div>
                    </div>

                    <div className="request-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Confirmer le retour"
                        onClick={() => setConfirmModal({
                          show: true,
                          id: emprunt.id,
                          userName,
                          bookTitle
                        })}
                      >
                        <i className="fas fa-check"></i> Confirmer retour
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {confirmModal.show && (
        <div className="modal-overlay active" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Confirmer le retour</h2>
              <button className="close-modal" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '10px 0', color: 'var(--light)', textAlign: 'center' }}>
                Voulez-vous confirmer le retour du livre <strong>"{confirmModal.bookTitle}"</strong> par <strong>{confirmModal.userName}</strong> ?
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <button className="btn btn-outline" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Non</button>
              <button className="btn btn-primary" onClick={handleReturn}>Oui, Retourné</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmpruntsEnAttenteRetour;
