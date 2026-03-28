import React, { useState, useEffect } from 'react';
import '../../styles/dashboardAdmin.css';
import '../../styles/sanctions.css';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import { getAllSanctions } from '../../services/sanctions.api';
import { getAllUsers } from '../../services/users.api';

function Sanctions() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [sanctions, setSanctions] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function fetchSanctions() {
    try {
      const data = await getAllSanctions();
      setSanctions(data || []);
    } catch (error) {
      console.error('Erreur chargement sanctions:', error);
    }
  }

  async function fetchEtudiants() {
    try {
      const data = await getAllUsers();
      const students = (data || []).filter(u => u.role === 'ETUDIANT');
      setEtudiants(students);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
    }
  }

  async function loadAllData() {
    setIsLoading(true);
    await Promise.all([fetchSanctions(), fetchEtudiants()]);
    setIsLoading(false);
  }

  const filteredSanctions = sanctions.filter(s => 
    (s.utilisateur?.nom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.raison || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  // ===== Stats =====
  const totalSanctions = sanctions.length;
  
  let totalPointsRetires = 0;
  sanctions.forEach(s => {
    totalPointsRetires += (s.penalitePoints);
  });

  const etudiantsSanctionnes = [...new Set(sanctions.map(s => s.utilisateurId))].length;

  return (
    <div className="app-wrapper sanctions-page">
      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="sanctions" />

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="icon-btn d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: sidebarOpen ? 'none' : undefined }}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-title">
              <h1>Historique des Sanctions ⚖️</h1>
              <p>Suivi des pénalités et blocages appliqués aux étudiants</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Rechercher un étudiant ou une raison..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-gavel"></i></div>
            </div>
            <h3>{isLoading ? '...' : totalSanctions}</h3>
            <p>Sanctions appliquées</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-coins"></i></div>
            </div>
            <h3>{isLoading ? '...' : totalPointsRetires}</h3>
            <p>Points retirés au total</p>
          </div>
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-slash"></i></div>
            </div>
            <h3>{isLoading ? '...' : etudiantsSanctionnes}</h3>
            <p>Étudiants impactés</p>
          </div>
        </div>

        {/* Historique des sanctions appliquées */}
        <div className="section-card">
          <div className="section-header">
            <h3><i className="fas fa-history" style={{ color: '#ef4444' }}></i> Journal des Sanctions</h3>
          </div>

          {isLoading ? (
            <div className="sanction-empty-state"><i className="fas fa-spinner fa-spin"></i><p>Chargement du journal...</p></div>
          ) : filteredSanctions.length === 0 ? (
            <div className="sanction-empty-state">
              <i className="fas fa-gavel"></i>
              <p>{searchQuery ? 'Aucun résultat trouvé' : "Aucune sanction n'a encore été enregistrée"}</p>
            </div>
          ) : (
            <div className="applied-sanctions-list">
              {filteredSanctions.map((sanction) => (
                <div key={sanction.id} className="applied-sanction-item">
                  <div className="applied-sanction-user-avatar">
                    {(sanction.utilisateur?.nom || '??').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--light)', fontSize: '0.95rem' }}>
                      {sanction.utilisateur?.nom || 'Utilisateur inconnu'}
                      {sanction.utilisateur?.prenom ? ` ${sanction.utilisateur.prenom}` : ''}
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {sanction.utilisateur?.email || ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <span style={{ display: 'block', fontWeight: 700, color: '#ef4444', fontSize: '0.95rem' }}>-{sanction.penalitePoints}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Points</span>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <span style={{ display: 'block', fontWeight: 700, color: '#f59e0b', fontSize: '0.95rem' }}>{sanction.dureeBlocage}j</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Blocage</span>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '150px' }}>
                    <span style={{
                      display: 'inline-block', padding: '0.3rem 0.7rem', borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 500
                    }}>
                      {sanction.raison || 'Non spécifiée'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
                      {sanction.dateCreation ? new Date(sanction.dateCreation).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Sanctions;
