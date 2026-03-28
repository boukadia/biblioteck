import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getRecompenses, acheterBonus, getMesBonus } from '../../services/shop.api';
import { getUserById } from '../../services/users.api';

const BONUS_ICONS = {
  'protection': 'fa-shield-alt',
  'durée': 'fa-clock',
  'points': 'fa-star',
  'default': 'fa-gift',
};

const BONUS_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #96e6a1, #d4fc79)',
];

function Boutique() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recompenses, setRecompenses] = useState([]);
  const [mesBonus, setMesBonus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [buyLoading, setBuyLoading] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [activeTab, setActiveTab] = useState('shop');

  useEffect(() => {
    loadData();
  }, []);

  async function fetchUser() {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.id) {
        const u = await getUserById(storedUser.id);
        if (u) {
          setUser(u);
        }
      }
    } catch (error) {
      console.error('Erreur chargement user:', error);
    }
  }

  async function fetchRecompenses() {
    try {
      const data = await getRecompenses();
      setRecompenses(data || []);
    } catch (error) {
      console.error('Erreur chargement recompenses:', error);
    }
  }

  async function fetchMesBonus() {
    try {
      const data = await getMesBonus();
      setMesBonus(data || []);
    } catch (error) {
      console.error('Erreur chargement mes bonus:', error);
    }
  }

  async function loadData() {
    setIsLoading(true);
    await fetchUser();
    await fetchRecompenses();
    await fetchMesBonus();
    setIsLoading(false);
  }

  async function handleBuy(id) {
    setBuyLoading(id);
    try {
      await acheterBonus(id);
      setSuccessModal({ show: true, message: 'Bonus acheté avec succès ! Vérifiez vos bonus dans l\'onglet "Mes Bonus".' });
      await loadData();
    } catch (err) {
      console.error('Erreur achat:', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de l\'achat.';
      setErrorModal({ show: true, message: Array.isArray(msg) ? msg.join(', ') : msg });
    }
    setBuyLoading(null);
  }

  function getBonusIcon(name) {
    const lower = (name || '').toLowerCase();
    for (const [key, icon] of Object.entries(BONUS_ICONS)) {
      if (lower.includes(key)) {
        return icon;
      }
    }
    return BONUS_ICONS.default;
  }

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="boutique"
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
                <h1>Boutique 🛒</h1>
                <p>Échangez vos points contre des bonus</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
              border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px',
              padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <i className="fas fa-coins" style={{ color: '#f59e0b', fontSize: '1.25rem' }}></i>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{user.points || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Points disponibles</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="emprunts-tabs" style={{ marginBottom: '2rem' }}>
          <button
            className={`emprunt-tab ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <i className="fas fa-store"></i> Boutique
            <span className="tab-count">{recompenses.length}</span>
          </button>
          <button
            className={`emprunt-tab ${activeTab === 'mybonus' ? 'active' : ''}`}
            onClick={() => setActiveTab('mybonus')}
          >
            <i className="fas fa-box-open"></i> Mes Bonus
            <span className="tab-count">{mesBonus.length}</span>
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement de la boutique...</p>
          </div>
        ) : activeTab === 'shop' ? (
          /* Shop Tab */
          recompenses.length === 0 ? (
            <div className="empty-emprunts">
              <i className="fas fa-store" style={{ display: 'block' }}></i>
              <p style={{ fontSize: '1.1rem' }}>La boutique est vide pour le moment.</p>
            </div>
          ) : (
            <div className="student-books-grid">
              {recompenses.map((item, index) => (
                <div key={item.id} className="student-book-card" style={{ cursor: 'default' }}>
                  <div className="student-book-cover" style={{ height: '160px' }}>
                    <div className="placeholder" style={{ background: BONUS_COLORS[index % BONUS_COLORS.length] }}>
                      <i className={`fas ${getBonusIcon(item.nom)}`} style={{ fontSize: '3rem' }}></i>
                    </div>
                  </div>
                  <div className="student-book-info">
                    <h4>{item.nom}</h4>
                    <p className="author" style={{ fontSize: '0.8rem', minHeight: '2.5rem' }}>{item.description || 'Bonus spécial'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>
                        <i className="fas fa-coins" style={{ marginRight: '0.35rem' }}></i>
                        {item.cout || item.prix || 0}
                      </span>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => handleBuy(item.id)}
                        disabled={buyLoading === item.id}
                      >
                        {buyLoading === item.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <><i className="fas fa-shopping-cart"></i> Acheter</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* My Bonus Tab */
          mesBonus.length === 0 ? (
            <div className="empty-emprunts">
              <i className="fas fa-box-open" style={{ display: 'block' }}></i>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Vous n'avez aucun bonus.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('shop')}>
                <i className="fas fa-store"></i> Visiter la boutique
              </button>
            </div>
          ) : (
            <div className="emprunts-list">
              {mesBonus.map((bonus, index) => (
                <div key={bonus.id} className="emprunt-card">
                  <div className="emprunt-cover" style={{ background: BONUS_COLORS[index % BONUS_COLORS.length] }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem' }}>
                      <i className={`fas ${getBonusIcon(bonus.recompense?.nom || bonus.nom)}`}></i>
                    </div>
                  </div>
                  <div className="emprunt-info">
                    <h4>{bonus.recompense?.nom || bonus.nom || 'Bonus'}</h4>
                    <p className="emprunt-author">{bonus.recompense?.description || bonus.description || 'Bonus obtenu'}</p>
                    <div className="emprunt-dates">
                      <span>
                        <i className="fas fa-calendar-plus"></i>
                        {bonus.dateAchat ? new Date(bonus.dateAchat).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="emprunt-status-col">
                    <span className={`emprunt-status-badge ${bonus.utilise ? 'retourne' : 'en-cours'}`}>
                      <i className={`fas ${bonus.utilise ? 'fa-check-circle' : 'fa-box-open'}`} style={{ marginRight: '0.35rem' }}></i>
                      {bonus.utilise ? 'Utilisé' : 'Disponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
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

      {/* Success Modal */}
      {successModal.show && (
        <div className="modal-overlay active" onClick={() => setSuccessModal({ show: false, message: '' })}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h2><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> Succès</h2>
              <button className="close-modal" onClick={() => setSuccessModal({ show: false, message: '' })}>&times;</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', color: '#10b981' }}>
                <i className="fas fa-check"></i>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {successModal.message}
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', borderTop: 'none' }}>
              <button className="btn btn-outline" onClick={() => setSuccessModal({ show: false, message: '' })}>
                <i className="fas fa-check"></i> OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Boutique;
