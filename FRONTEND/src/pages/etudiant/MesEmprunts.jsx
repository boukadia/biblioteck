import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getMesEmprunts, declarerRetour, annule } from '../../services/emprunts.api';
import { getUserById } from '../../services/users.api';

const STATUS_MAP = {
  EN_COURS: { label: 'En cours', css: 'en-cours', icon: 'fa-book-reader' },
  EN_ATTENTE: { label: 'En attente', css: 'en-attente', icon: 'fa-clock' },
  RETOURNE: { label: 'Retourné', css: 'retourne', icon: 'fa-check-circle' },
  EN_RETARD: { label: 'En retard', css: 'en-retard', icon: 'fa-exclamation-triangle' },
  EN_ATTENTE_RETOUR: { label: 'Attente retour', css: 'en-attente', icon: 'fa-hourglass-half' },
  ANNULE: { label: 'Annulé', css: 'retourne', icon: 'fa-ban' },
};

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
];

function StudentEmprunts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emprunts, setEmprunts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [user, setUser] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });

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
      const data = await getMesEmprunts();
      setEmprunts(data || []);
    } catch (error) {
      console.error('Erreur chargement emprunts:', error);
    }
    setIsLoading(false);
  }

  // Filtered emprunts by tab
  const filteredEmprunts = emprunts.filter(e => {
    if (activeTab === 'all') {
      return true;
    }
    if (activeTab === 'actifs') {
      return ['EN_COURS', 'EN_ATTENTE', 'EN_ATTENTE_RETOUR'].includes(e.statut);
    }
    if (activeTab === 'retards') {
      return e.statut === 'EN_RETARD';
    }
    if (activeTab === 'retournes') {
      return e.statut === 'RETOURNE';
    }
    return true;
  });

  // Counts
  const counts = {
    all: emprunts.length,
    actifs: emprunts.filter(e => ['EN_COURS', 'EN_ATTENTE', 'EN_ATTENTE_RETOUR'].includes(e.statut)).length,
    retards: emprunts.filter(e => e.statut === 'EN_RETARD').length,
    retournes: emprunts.filter(e => e.statut === 'RETOURNE').length,
  };

  // Days remaining/overdue
  function getDueInfo(emprunt) {
    if (!emprunt.dateEcheance) {
      return null;
    }
    const now = new Date();
    const due = new Date(emprunt.dateEcheance);
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (emprunt.statut === 'RETOURNE' || emprunt.statut === 'ANNULE') {
      return null;
    }

    if (diffDays < 0) {
      return { text: `En retard de ${Math.abs(diffDays)} jour(s)`, css: 'danger', icon: 'fa-exclamation-circle' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} jour(s) restant(s)`, css: 'warning', icon: 'fa-exclamation-triangle' };
    } else {
      return { text: `${diffDays} jour(s) restant(s)`, css: 'safe', icon: 'fa-calendar' };
    }
  }

  // Actions
  async function handleReturn(id) {
    setActionLoading(id);
    try {
      await declarerRetour(id);
      await loadData();
    } catch (err) {
      console.error('Erreur déclaration retour:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la déclaration de retour.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setActionLoading(null);
  }

  async function handleCancel(id) {
    setActionLoading(id);
    try {
      await annule(id);
      await loadData();
    } catch (err) {
      console.error('Erreur annulation:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de l\'annulation.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setActionLoading(null);
  }

  const tabs = [
    { id: 'all', label: 'Tous', icon: 'fa-list' },
    { id: 'actifs', label: 'Actifs', icon: 'fa-book-reader' },
    { id: 'retards', label: 'En retard', icon: 'fa-exclamation-triangle' },
    { id: 'retournes', label: 'Retournés', icon: 'fa-check-circle' },
  ];

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="emprunts-actifs"
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
                <h1>Mes Emprunts 📖</h1>
                <p>Gérer vos emprunts de livres</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => window.location.href = '/livres'}>
              <i className="fas fa-plus"></i> Emprunter un livre
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-book"></i></div>
            </div>
            <h3>{isLoading ? '...' : counts.all}</h3>
            <p>Total emprunts</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-book-reader"></i></div>
            </div>
            <h3>{isLoading ? '...' : counts.actifs}</h3>
            <p>Emprunts actifs</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
            </div>
            <h3>{isLoading ? '...' : counts.retards}</h3>
            <p>En retard</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            </div>
            <h3>{isLoading ? '...' : counts.retournes}</h3>
            <p>Retournés</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="emprunts-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`emprunt-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
              <span className="tab-count">{counts[tab.id]}</span>
            </button>
          ))}
        </div>

        {/* Emprunts List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement de vos emprunts...</p>
          </div>
        ) : filteredEmprunts.length === 0 ? (
          <div className="empty-emprunts">
            <i className="fas fa-inbox" style={{ display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              {activeTab === 'all' ? 'Vous n\'avez aucun emprunt.' : 'Aucun emprunt dans cette catégorie.'}
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/livres'}>
              <i className="fas fa-book"></i> Découvrir des livres
            </button>
          </div>
        ) : (
          <div className="emprunts-list">
            {filteredEmprunts.map((emprunt, index) => {
              const statusInfo = STATUS_MAP[emprunt.statut] || { label: emprunt.statut, css: 'en-cours', icon: 'fa-question' };
              const dueInfo = getDueInfo(emprunt);

              return (
                <div key={emprunt.id} className={`emprunt-card ${emprunt.statut === 'EN_RETARD' ? 'overdue' : ''}`}>
                  <div className="emprunt-cover">
                    {emprunt.livre?.image ? (
                      <img src={emprunt.livre.image} alt={emprunt.livre?.titre} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: GRADIENT_COLORS[index % GRADIENT_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}>
                        <i className="fas fa-book"></i>
                      </div>
                    )}
                  </div>

                  <div className="emprunt-info">
                    <h4>{emprunt.livre?.titre || 'Livre inconnu'}</h4>
                    <p className="emprunt-author">{emprunt.livre?.auteur || 'Auteur inconnu'}</p>
                    <div className="emprunt-dates">
                      <span>
                        <i className="fas fa-calendar-plus"></i>
                        {emprunt.dateEmprunt ? new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR') : '-'}
                      </span>
                      <span>
                        <i className="fas fa-calendar-check"></i>
                        {emprunt.dateEcheance ? new Date(emprunt.dateEcheance).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="emprunt-status-col">
                    <span className={`emprunt-status-badge ${statusInfo.css}`}>
                      <i className={`fas ${statusInfo.icon}`} style={{ marginRight: '0.35rem' }}></i>
                      {statusInfo.label}
                    </span>

                    {dueInfo && (
                      <span className={`due-info ${dueInfo.css}`}>
                        <i className={`fas ${dueInfo.icon}`}></i>
                        {dueInfo.text}
                      </span>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      {['EN_COURS', 'EN_RETARD'].includes(emprunt.statut) && (
                        <button
                          className="emprunt-action-btn return-btn"
                          onClick={() => handleReturn(emprunt.id)}
                          disabled={actionLoading === emprunt.id}
                        >
                          {actionLoading === emprunt.id ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-undo"></i> Déclarer retour</>}
                        </button>
                      )}
                      {emprunt.statut === 'EN_ATTENTE' && (
                        <button
                          className="emprunt-action-btn cancel-btn"
                          onClick={() => handleCancel(emprunt.id)}
                          disabled={actionLoading === emprunt.id}
                        >
                          {actionLoading === emprunt.id ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-times"></i> Annuler</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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

export default StudentEmprunts;
