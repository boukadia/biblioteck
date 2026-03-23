import React, { useState, useEffect } from 'react';
import '../../styles/adminEmprunts.css';
import StatsCard from '../../components/dashboard/admin/StatsCard';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { getAllEmprunts } from '../../services/emprunts.api.js';
import { getAdminStats } from '../../services/stats.api';

function TousLesEmprunts() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allEmprunts, setAllEmprunts] = useState([]);

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

    async function loadEmprunts() {
      try {
        const empruntsData = await getAllEmprunts();
        setAllEmprunts(empruntsData || []);
      } catch (error) {
        console.error('Error loading emprunts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEmprunts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'EN_ATTENTE': 
        return <span className="status-badge" style={{ background: '#f59e0b20', color: '#f59e0b' }}>En attente</span>;
      case 'EN_COURS': 
        return <span className="status-badge" style={{ background: '#3b82f620', color: '#3b82f6' }}>En cours</span>;
      case 'ANNULE': 
        return <span className="status-badge" style={{ background: '#ef444420', color: '#ef4444' }}>Annulé</span>;
      case 'EN_RETARD': 
        return <span className="status-badge" style={{ background: '#dc262620', color: '#dc2626', fontWeight: 'bold' }}>En retard</span>;
      case 'EN_ATTENTE_RETOUR': 
        return <span className="status-badge" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>Attente retour</span>;
      case 'RETOURNE': 
        return <span className="status-badge" style={{ background: '#10b98120', color: '#10b981' }}>Retourné</span>;
      default: 
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="loan-requests-page">
      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="all-loans" />

      <main className="main-content">
        <header className="header">
          <div className="d-flex align-items-center gap-3">
            <button className="mobile-menu-btn d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-title">
              <h1>Tous les Emprunts 📚</h1>
              <p>Historique complet de la bibliothèque</p>
            </div>
          </div>
        </header>

        <div className="stats-grid">
            <StatsCard stats={stats} />
        </div>

        <div className="section-card">
          <div className="card-header">
            <h3><i className="fas fa-history" style={{ color: '#6366f1' }}></i> Liste Complète</h3>
          </div>

          {isLoading ? (
            <div className="empty-state"><i className="fas fa-spinner fa-spin"></i><p>Chargement...</p></div>
          ) : allEmprunts.length === 0 ? (
            <div className="empty-state"><i className="fas fa-inbox"></i><p>Aucun emprunt trouvé</p></div>
          ) : (
            allEmprunts.map((emprunt) => {
              const user = emprunt.utilisateur;
              const book = emprunt.livre;
              const userInitials = user?.initials || user?.nom?.substring(0, 2).toUpperCase() || '??';
              
              return (
                <div key={emprunt.id} className="request-card">
                  <div className="request-body">
                    <div className="request-user">
                      <div className="user-avatar-sm">{userInitials}</div>
                      <div>
                        <h5>{user?.nom || 'Utilisateur'}</h5>
                        <div className="user-level">Niveau {user?.niveau || 1}</div>
                      </div>
                    </div>

                    <div className="request-book">
                      <div className="book-cover-sm"></div>
                      <div>
                        <h5>{book?.titre || 'Sans titre'}</h5>
                        <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{book?.auteur}</span>
                      </div>
                    </div>

                    <div className="request-time text-center">
                       {getStatusBadge(emprunt.statut || emprunt.status)}
                    </div>

                    <div className="request-time text-end">
                      <span className="date">{new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default TousLesEmprunts;
