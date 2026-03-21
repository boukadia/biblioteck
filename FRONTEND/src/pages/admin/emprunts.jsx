import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';
// import StatsCard from '../components/StatsCard';
// import RequestCard from '../components/RequestCard';
// import RejectModal from '../components/RejectModal';
import '../../styles/adminEmprunts.css';
import StatsCard from '../../components/dashboard/admin/StatsCard';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { annule, validerEmprunt, getEmpruntsEnAttente } from '../../services/emprunts.api.js';
import { getAdminStats } from '../../services/stats.api';

function Emprunts() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empruntsEnAttente, setEmpruntsEnAttente] = useState([]);
  
  // States for simple confirmation
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // 'approve' or 'reject'
    id: null,
    userName: ''
  });

  useEffect(() => {
    // Exact pattern from DashboardAdmin.jsx
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

    async function loadEmprunts() {
      try {
        const data = await getEmpruntsEnAttente();
        setEmpruntsEnAttente(data || []);
      } catch (error) {
        console.error('Error loading emprunts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEmprunts();
  }, []);

  const refreshData = async () => {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
      const data = await getEmpruntsEnAttente();
      setEmpruntsEnAttente(data || []);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleAction = async () => {
    try {
      if (confirmModal.action === 'approve') {
        await validerEmprunt(confirmModal.id);
      } else {
        await annule(confirmModal.id);
      }
      await refreshData();
    } catch (error) {
      console.error('Error executing action:', error);
    } finally {
      setConfirmModal({ show: false, action: null, id: null, userName: '' });
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
        activePage="loan-requests"
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
              <h1>Demandes d'emprunt 📋</h1>
              <p>Gérer les demandes en attente</p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
            <StatsCard stats={stats} />
        </div>

        {/* Requests List */}
        <div className="section-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-list" style={{ color: '#f59e0b' }}></i>
              {' '}Demandes en attente
            </h3>
          </div>

          {isLoading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Chargement...</p>
            </div>
          ) : empruntsEnAttente.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>Aucune demande en attente</p>
            </div>
          ) : (
            empruntsEnAttente.map((emprunt) => {
              const user = emprunt.utilisateur;
              const book = emprunt.livre;
              const userInitials = user?.initials || user?.nom?.substring(0, 2).toUpperCase() || '??';
              const userName = user?.nom || 'Utilisateur inconnu';
              const userLevel = user?.niveau || 1;
              const userLevelIcon = userLevel >= 8 ? '👑' : (userLevel >= 4 ? '⭐' : '📖');

              return (
                <div key={emprunt.id} className="request-card">
                  <div className="request-body">
                    <div className="request-user">
                      <div className="user-avatar-sm">{userInitials}</div>
                      <div>
                        <h5>{userName}</h5>
                        <div className="user-level">{userLevelIcon} Niveau {userLevel}</div>
                      </div>
                    </div>

                    <div className="request-book">
                      <div className="book-cover-sm"></div>
                      <div>
                        <h5>{book?.titre || 'Sans titre'}</h5>
                        <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                          {book?.auteur || 'Auteur inconnu'}
                        </span>
                        <div style={{ marginTop: '0.25rem' }}>
                          <span className="status-badge available" style={{ fontSize: '0.7rem' }}>Disponible</span>
                        </div>
                      </div>
                    </div>

                    <div className="request-time">
                      <span className="date">
                        {emprunt.dateEmprunt ? new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>

                    <div className="request-actions">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setConfirmModal({ show: true, action: 'approve', id: emprunt.id, userName })}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmModal({ show: true, action: 'reject', id: emprunt.id, userName })}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Simple Confirmation Modal UI */}
      {confirmModal.show && (
        <div className="modal-overlay active" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Confirmation</h2>
              <button className="close-modal" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '10px 0', color: 'var(--light)', textAlign: 'center' }}>
                Voulez-vous vraiment {confirmModal.action === 'approve' ? 'ACCEPTER' : 'REFUSER'} l'emprunt de <strong>{confirmModal.userName}</strong> ?
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <button className="btn btn-outline" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Non</button>
              <button 
                className={`btn btn-${confirmModal.action === 'approve' ? 'success' : 'danger'}`} 
                onClick={handleAction}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Emprunts;