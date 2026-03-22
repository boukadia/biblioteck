import React, { useState, useEffect } from 'react';
import '../../styles/adminEmprunts.css';
import StatsCard from '../../components/dashboard/admin/StatsCard';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { getEmpruntsEnRetard, retournerLivre } from '../../services/emprunts.api.js';
import { getAdminStats } from '../../services/stats.api';

function EmpruntsEnRetard() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empruntsEnRetard, setEmpruntsEnRetard] = useState([]);
  
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
    userName: '',
    bookTitle: ''
  });
  console.log('stats',stats);
  

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

    async function loadRetards() {
      try {
        const retardsData = await getEmpruntsEnRetard();
        setEmpruntsEnRetard(retardsData || []);
      } catch (error) {
        console.error('Error loading retards:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRetards();
  }, []);

  const refreshData = async () => {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
      const data = await getEmpruntsEnRetard();
      setEmpruntsEnRetard(data || []);
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
        activePage="overdue-loans"
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
              <h1>Emprunts en Retard ⏰</h1>
              <p>Gérer les livres non retournés à temps</p>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
              <i className="fas fa-user-clock" style={{ color: 'var(--danger)' }}></i>
            </div>
            <div className="stat-info">
              <p>Étudiants en Retard</p>
              <span>{isLoading ? '...' : stats.etudiantsEnRetard ?? '0'}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
              <i className="fas fa-book-dead" style={{ color: 'var(--warning)' }}></i>
            </div>
            <div className="stat-info">
              <p>Total des Retards</p>
              <span>{isLoading ? '...' : stats.empruntsEnRetard ?? '0'}</span>
            </div>
          </div>
        </div>
        {/* <div className="stats-grid">
            <StatsCard stats={stats} />
        </div> */}

        {/* Overdue List */}
        <div className="section-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444' }}></i>
              {' '}Retards Actuels
            </h3>
          </div>

          {isLoading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Chargement...</p>
            </div>
          ) : empruntsEnRetard.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              <p>Aucun emprunt en retard pour le moment</p>
            </div>
          ) : (
            empruntsEnRetard.map((emprunt) => {
              const user = emprunt.utilisateur;
              const book = emprunt.livre;
              const userInitials = user?.initials || user?.nom?.substring(0, 2).toUpperCase() || '??';
              const userName = user?.nom || 'Utilisateur inconnu';
              const bookTitle = book?.titre || 'Sans titre';
              
              const datePrevue = new Date(emprunt.dateRetourPrevue);
              const diffTime = Math.abs(new Date() - datePrevue);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div key={emprunt.id} className="request-card overdue">
                  <div className="request-body">
                    <div className="request-user">
                      <div className="user-avatar-sm" style={{ background: 'var(--danger-light)' }}>{userInitials}</div>
                      <div>
                        <h5>{userName}</h5>
                        <div className="user-level" style={{ color: 'var(--danger)' }}>
                           Retard de {diffDays} jour{diffDays > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="request-book">
                      <div className="book-cover-sm"></div>
                      <div>
                        <h5>{bookTitle}</h5>
                        <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                          Prévu le: {datePrevue.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="request-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Marquer comme retourné"
                        onClick={() => setConfirmModal({ 
                          show: true, 
                          id: emprunt.id, 
                          userName, 
                          bookTitle 
                        })}
                      >
                        <i className="fas fa-undo"></i> Retourner
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
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

export default EmpruntsEnRetard;
