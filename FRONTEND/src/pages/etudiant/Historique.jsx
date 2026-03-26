import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getMonHistorique } from '../../services/historique.api';
import { getUserById } from '../../services/users.api';

const TYPE_MAP = {
  GAIN_EMPRUNT: { label: 'Emprunt', icon: 'fa-book-reader', color: '#10b981', sign: '+' },
  PERTE_RETARD: { label: 'Retard', icon: 'fa-exclamation-triangle', color: '#ef4444', sign: '-' },
  ACHAT_BOUTIQUE: { label: 'Achat boutique', icon: 'fa-shopping-cart', color: '#f59e0b', sign: '-' },
  SANCTION_ADMIN: { label: 'Sanction', icon: 'fa-gavel', color: '#ef4444', sign: '-' },
};

function Historique() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [filterType, setFilterType] = useState('all');

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
      const data = await getMonHistorique();
      setHistorique(data || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
    setIsLoading(false);
  }

  const filteredHistorique = historique.filter(entry => {
    if (filterType === 'all') {
      return true;
    }
    if (filterType === 'gains') {
      return entry.montant > 0;
    }
    if (filterType === 'pertes') {
      return entry.montant < 0;
    }
    return entry.type === filterType;
  });

  // Calculate totals
  const totalGains = historique.filter(e => e.montant > 0).reduce((sum, e) => sum + e.montant, 0);
  const totalPertes = historique.filter(e => e.montant < 0).reduce((sum, e) => sum + Math.abs(e.montant), 0);

  const filterOptions = [
    { value: 'all', label: 'Tous', icon: 'fa-list' },
    { value: 'gains', label: 'Gains', icon: 'fa-arrow-up' },
    { value: 'pertes', label: 'Pertes', icon: 'fa-arrow-down' },
    { value: 'GAIN_EMPRUNT', label: 'Emprunts', icon: 'fa-book-reader' },
    { value: 'PERTE_RETARD', label: 'Retards', icon: 'fa-exclamation-triangle' },
    { value: 'ACHAT_BOUTIQUE', label: 'Boutique', icon: 'fa-shopping-cart' },
    { value: 'SANCTION_ADMIN', label: 'Sanctions', icon: 'fa-gavel' },
  ];

  function formatDate(dateStr) {
    if (!dateStr) {
      return '-';
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="historique"
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
                <h1>Historique des Points 📊</h1>
                <p>Suivez l'évolution de vos points</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-coins"></i></div>
            </div>
            <h3>{isLoading ? '...' : user.pointsActuels || 0}</h3>
            <p>Points actuels</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-arrow-up"></i></div>
            </div>
            <h3>{isLoading ? '...' : '+' + totalGains}</h3>
            <p>Total gagnés</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-arrow-down"></i></div>
            </div>
            <h3>{isLoading ? '...' : '-' + totalPertes}</h3>
            <p>Total perdus</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-exchange-alt"></i></div>
            </div>
            <h3>{isLoading ? '...' : historique.length}</h3>
            <p>Mouvements</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="emprunts-tabs" style={{ marginBottom: '2rem' }}>
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              className={`emprunt-tab ${filterType === opt.value ? 'active' : ''}`}
              onClick={() => setFilterType(opt.value)}
            >
              <i className={`fas ${opt.icon}`}></i>
              {opt.label}
              {opt.value === 'all' && <span className="tab-count">{historique.length}</span>}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="results-header">
          <div className="results-count">
            <strong>{filteredHistorique.length}</strong> mouvement{filteredHistorique.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Historique List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement de l'historique...</p>
          </div>
        ) : filteredHistorique.length === 0 ? (
          <div className="empty-emprunts">
            <i className="fas fa-history" style={{ display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem' }}>Aucun mouvement trouvé.</p>
          </div>
        ) : (
          <div className="emprunts-list">
            {filteredHistorique.map((entry) => {
              const typeInfo = TYPE_MAP[entry.type] || { label: entry.type, icon: 'fa-circle', color: '#64748b', sign: '' };
              const isGain = entry.montant > 0;

              return (
                <div key={entry.id} className="emprunt-card">
                  {/* Icon */}
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                    background: `${typeInfo.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', color: typeInfo.color
                  }}>
                    <i className={`fas ${typeInfo.icon}`}></i>
                  </div>

                  {/* Info */}
                  <div className="emprunt-info">
                    <h4 style={{ marginBottom: '0.35rem' }}>{entry.description || typeInfo.label}</h4>
                    <div className="emprunt-dates">
                      <span>
                        <i className="fas fa-calendar"></i>
                        {formatDate(entry.dateMouvement)}
                      </span>
                      <span style={{
                        background: `${typeInfo.color}20`,
                        color: typeInfo.color,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <i className={`fas ${typeInfo.icon}`} style={{ marginRight: '0.25rem' }}></i>
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '80px' }}>
                    <div style={{
                      fontSize: '1.35rem', fontWeight: 800,
                      color: isGain ? '#10b981' : '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem'
                    }}>
                      <i className={`fas ${isGain ? 'fa-arrow-up' : 'fa-arrow-down'}`} style={{ fontSize: '0.8rem' }}></i>
                      {isGain ? '+' : ''}{entry.montant}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Historique;
