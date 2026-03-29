import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getMesEmprunts, declarerRetour, annule, prolongerEmprunt } from '../../services/emprunts.api';
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

  // Modal Prolongation
  const [showProlongModal, setShowProlongModal] = useState({ show: false, empruntId: null });
  const [prolongMsg, setProlongMsg] = useState({ type: '', text: '' });

  // Modal Déclarer Retour
  const [showReturnModal, setShowReturnModal] = useState({ show: false, empruntId: null, isLate: false });
  const [returnMsg, setReturnMsg] = useState({ type: '', text: '' });
  const [selectedProtectionId, setSelectedProtectionId] = useState(null);

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
  async function handleReturnClick(emprunt) {
    const isLate = emprunt.statut === 'EN_RETARD';
    setShowReturnModal({ show: true, empruntId: emprunt.id, isLate: isLate });
    setSelectedProtectionId(null);
    setReturnMsg({ type: '', text: '' });
  }

  async function handleConfirmReturn() {
    setActionLoading(showReturnModal.empruntId);
    setReturnMsg({ type: '', text: '' });
    try {
      await declarerRetour(showReturnModal.empruntId, selectedProtectionId);
      setReturnMsg({ type: 'success', text: 'Succès ! Votre demande de retour a été envoyée.' });
      setTimeout(() => {
        setShowReturnModal({ show: false, empruntId: null });
        loadData();
      }, 2000);
    } catch (err) {
      console.error('Erreur déclaration retour:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la déclaration de retour.';
      setReturnMsg({ type: 'danger', text: Array.isArray(msg) ? msg.join(', ') : msg });
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

  async function handleProlonger(bonusId) {
    setActionLoading(showProlongModal.empruntId);
    setProlongMsg({ type: '', text: '' });
    try {
      await prolongerEmprunt(showProlongModal.empruntId, bonusId);
      setProlongMsg({ type: 'success', text: 'Prolongation effectuée avec succès ! (+7 jours)' });
      setTimeout(() => {
        setShowProlongModal({ show: false, empruntId: null });
        loadData();
      }, 2000);
    } catch (err) {
      console.error('Erreur prolongation:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la prolongation.';
      setProlongMsg({ type: 'danger', text: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setActionLoading(null);
  }

  const tabs = [
    { id: 'all', label: 'Tous', icon: 'fa-list' },
    { id: 'actifs', label: 'Actifs', icon: 'fa-book-reader' },
    { id: 'retards', label: 'En retard', icon: 'fa-exclamation-triangle' },
    { id: 'retournes', label: 'Retournés', icon: 'fa-check-circle' },
  ];

  const prolongationBonuses = user.bonusPossedes?.filter(b => b.recompense.type === 'PROLONGATION') || [];
  const protectionBonuses = user.bonusPossedes?.filter(b => b.recompense.type === 'PROTECTION') || [];

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
                      {emprunt.statut === 'EN_COURS' && (
                        <button
                          className="emprunt-action-btn prolong-btn"
                          onClick={() => setShowProlongModal({ show: true, empruntId: emprunt.id })}
                          style={{ background: '#f59e0b', color: 'white' }}
                          disabled={actionLoading === emprunt.id}
                        >
                          <i className="fas fa-hourglass-start"></i> Prolonger
                        </button>
                      )}
                      {['EN_COURS', 'EN_RETARD'].includes(emprunt.statut) && (
                        <button
                          className="emprunt-action-btn return-btn"
                          onClick={() => handleReturnClick(emprunt)}
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

      {/* Prolongation Modal */}
      {showProlongModal.show && (
        <div className="modal-overlay active" onClick={() => setShowProlongModal({ show: false, empruntId: null })}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-hourglass-start" style={{ color: '#f59e0b' }}></i> Prolongation de l'emprunt</h2>
              <button className="close-modal" onClick={() => setShowProlongModal({ show: false, empruntId: null })}>&times;</button>
            </div>
            <div className="modal-body">
              {prolongMsg.text && (
                <div className={`alert alert-${prolongMsg.type}`} style={{ marginBottom: '1.5rem' }}>
                  {prolongMsg.text}
                </div>
              )}
              
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                Utilisez un bonus de <strong>PROLONGATION</strong> pour ajouter 7 jours supplémentaires à votre délai de lecture.
              </p>

              <div className="bonus-selection-list">
                {prolongationBonuses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px dashed #ef4444' }}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Vous n'avez aucun bonus de prolongation disponible.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/boutique'}>
                      Aller à la boutique
                    </button>
                  </div>
                ) : (
                  prolongationBonuses.map(bonus => (
                    <div key={bonus.id} className="bonus-select-item" onClick={() => handleProlonger(bonus.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                      background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', cursor: 'pointer',
                      border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '0.75rem', transition: 'all 0.2s'
                    }}>
                      <div style={{ fontSize: '1.5rem', color: '#f59e0b' }}><i className="fas fa-hourglass-half"></i></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'white' }}>{bonus.recompense.nom}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>+7 jours d'emprunt supplémentaire</div>
                      </div>
                      <button className="btn btn-primary btn-sm" disabled={actionLoading === showProlongModal.empruntId}>
                        Utiliser
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Déclarer Retour Modal */}
      {showReturnModal.show && (
        <div className="modal-overlay active" onClick={() => setShowReturnModal({ show: false, empruntId: null })}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-undo" style={{ color: '#6366f1' }}></i> Déclarer le retour</h2>
              <button className="close-modal" onClick={() => setShowReturnModal({ show: false, empruntId: null })}>&times;</button>
            </div>
            <div className="modal-body">
              {returnMsg.text && (
                <div className={`alert alert-${returnMsg.type}`} style={{ marginBottom: '1.5rem' }}>
                  {returnMsg.text}
                </div>
              )}

              {showReturnModal.isLate ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.25rem' }}></i>
                    <p style={{ margin: 0, fontWeight: 500 }}>Attention : Vous êtes en retard !</p>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Une pénalité sera appliquée à votre compte sauf si vous utilisez un **BOUCLIER DE PROTECTION** :
                  </p>

                  <div className="bonus-mini-list" style={{ marginTop: '1rem' }}>
                    {protectionBonuses.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px dashed #475569' }}>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Aucun bouclier disponible dans votre inventaire.</p>
                      </div>
                    ) : (
                      protectionBonuses.map(bonus => (
                        <div 
                          key={bonus.id} 
                          className={`bonus-mini-item ${selectedProtectionId === bonus.id ? 'selected' : ''}`}
                          onClick={() => setSelectedProtectionId(bonus.id)}
                          style={{
                            padding: '0.75rem', borderRadius: '10px', background: selectedProtectionId === bonus.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedProtectionId === bonus.id ? '#10b981' : 'transparent'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', transition: 'all 0.2s'
                          }}
                        >
                          <i className="fas fa-shield-alt" style={{ color: '#10b981' }}></i>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{bonus.recompense.nom}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Annule les pénalités de retard</div>
                          </div>
                          {selectedProtectionId === bonus.id && <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Confirmez-vous avoir rendu le livre à la bibliothèque ? L'administrateur devra valider votre demande.
                </p>
              )}
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setShowReturnModal({ show: false, empruntId: null })}>Annuler</button>
              <button className="btn btn-primary" onClick={handleConfirmReturn} disabled={actionLoading === showReturnModal.empruntId}>
                {actionLoading === showReturnModal.empruntId ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Confirmer le retour</>}
              </button>
            </div>
          </div>
        </div>
      )}

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
