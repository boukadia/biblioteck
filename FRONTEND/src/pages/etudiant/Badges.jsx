import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getMesBadges, getAllBadges } from '../../services/badges.api';
import { getUserById } from '../../services/users.api';

const BADGE_COLORS = [
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #f97316, #ea580c)',
  'linear-gradient(135deg, #ec4899, #db2777)',
];

const BADGE_ICONS = [
  'fa-medal', 'fa-award', 'fa-star', 'fa-trophy',
  'fa-crown', 'fa-gem', 'fa-certificate', 'fa-ribbon',
];

function Badges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mesBadges, setMesBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('mes-badges');
  const [selectedBadge, setSelectedBadge] = useState(null);

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

  async function fetchMesBadges() {
    try {
      const data = await getMesBadges();
      setMesBadges(data || []);
    } catch (error) {
      console.error('Erreur chargement mes badges:', error);
    }
  }

  async function fetchAllBadges() {
    try {
      const data = await getAllBadges();
      setAllBadges(data || []);
    } catch (error) {
      console.error('Erreur chargement all badges:', error);
    }
  }

  async function loadData() {
    setIsLoading(true);
    await fetchUser();
    await fetchMesBadges();
    await fetchAllBadges();
    setIsLoading(false);
  }

  const myBadgeIds = mesBadges.map(b => b.badge?.id || b.badgeId || b.id);

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="badges"
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
                <h1>Mes Badges 🎖️</h1>
                <p>Vos récompenses et accomplissements</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-medal"></i></div>
            </div>
            <h3>{isLoading ? '...' : mesBadges.length}</h3>
            <p>Badges obtenus</p>
          </div>
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-award"></i></div>
            </div>
            <h3>{isLoading ? '...' : allBadges.length}</h3>
            <p>Badges disponibles</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-percentage"></i></div>
            </div>
            <h3>{isLoading ? '...' : allBadges.length > 0 ? Math.round((mesBadges.length / allBadges.length) * 100) + '%' : '0%'}</h3>
            <p>Progression</p>
          </div>
        </div>

        {/* Progress bar */}
        {!isLoading && allBadges.length > 0 && (
          <div style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Progression globale</span>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{mesBadges.length} / {allBadges.length}</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                width: `${(mesBadges.length / allBadges.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '10px',
                transition: 'width 0.6s ease'
              }}></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="emprunts-tabs" style={{ marginBottom: '2rem' }}>
          <button
            className={`emprunt-tab ${activeTab === 'mes-badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('mes-badges')}
          >
            <i className="fas fa-medal"></i> Mes Badges
            <span className="tab-count">{mesBadges.length}</span>
          </button>
          <button
            className={`emprunt-tab ${activeTab === 'tous' ? 'active' : ''}`}
            onClick={() => setActiveTab('tous')}
          >
            <i className="fas fa-th"></i> Tous les Badges
            <span className="tab-count">{allBadges.length}</span>
          </button>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement des badges...</p>
          </div>
        ) : (
          <div className="student-books-grid">
            {(activeTab === 'mes-badges' ? mesBadges : allBadges).length === 0 ? (
              <div className="empty-emprunts" style={{ gridColumn: '1 / -1' }}>
                <i className="fas fa-medal" style={{ display: 'block' }}></i>
                <p style={{ fontSize: '1.1rem' }}>
                  {activeTab === 'mes-badges'
                    ? 'Vous n\'avez pas encore de badges. Continuez à lire !'
                    : 'Aucun badge disponible.'}
                </p>
              </div>
            ) : (
              (activeTab === 'mes-badges' ? mesBadges : allBadges).map((item, index) => {
                const badge = item.badge || item;
                const isOwned = myBadgeIds.includes(badge.id);

                return (
                  <div
                    key={badge.id || index}
                    className="student-book-card"
                    style={{ cursor: 'pointer', opacity: activeTab === 'tous' && !isOwned ? 0.6 : 1 }}
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="student-book-cover" style={{ height: '160px' }}>
                      <div className="placeholder" style={{
                        background: isOwned
                          ? BADGE_COLORS[index % BADGE_COLORS.length]
                          : 'linear-gradient(135deg, #334155, #1e293b)'
                      }}>
                        <i className={`fas ${BADGE_ICONS[index % BADGE_ICONS.length]}`} style={{
                          fontSize: '3.5rem',
                          color: isOwned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'
                        }}></i>
                      </div>
                      {isOwned && (
                        <span className="student-book-status available">
                          <i className="fas fa-check" style={{ marginRight: '0.25rem' }}></i> Obtenu
                        </span>
                      )}
                      {!isOwned && activeTab === 'tous' && (
                        <span className="student-book-status unavailable">
                          <i className="fas fa-lock" style={{ marginRight: '0.25rem' }}></i> Verrouillé
                        </span>
                      )}
                    </div>
                    <div className="student-book-info">
                      <h4>{badge.nom || badge.name || 'Badge'}</h4>
                      <p className="author" style={{ fontSize: '0.8rem' }}>{badge.description || 'Badge spécial'}</p>
                      {badge.condition && (
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.1)', padding: '0.35rem 0.6rem',
                          borderRadius: '6px', fontSize: '0.7rem', color: '#6366f1', marginTop: '0.5rem'
                        }}>
                          <i className="fas fa-info-circle" style={{ marginRight: '0.25rem' }}></i>
                          {badge.condition}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="modal-overlay active" onClick={() => setSelectedBadge(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-medal" style={{ color: '#f59e0b' }}></i> Détails du badge</h2>
              <button className="close-modal" onClick={() => setSelectedBadge(null)}>&times;</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: myBadgeIds.includes(selectedBadge.id)
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #334155, #1e293b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '3rem',
                color: myBadgeIds.includes(selectedBadge.id) ? 'white' : 'rgba(255,255,255,0.2)',
                boxShadow: myBadgeIds.includes(selectedBadge.id) ? '0 8px 32px rgba(245, 158, 11, 0.3)' : 'none'
              }}>
                <i className="fas fa-medal"></i>
              </div>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                {selectedBadge.nom || selectedBadge.name || 'Badge'}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                {selectedBadge.description || 'Badge spécial'}
              </p>
              {selectedBadge.condition && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)', padding: '1rem',
                  borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)'
                }}>
                  <p style={{ color: '#6366f1', margin: 0, fontSize: '0.9rem' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                    Condition : {selectedBadge.condition}
                  </p>
                </div>
              )}
              <div style={{ marginTop: '1.5rem' }}>
                <span className={`emprunt-status-badge ${myBadgeIds.includes(selectedBadge.id) ? 'retourne' : 'en-attente'}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  <i className={`fas ${myBadgeIds.includes(selectedBadge.id) ? 'fa-check-circle' : 'fa-lock'}`} style={{ marginRight: '0.35rem' }}></i>
                  {myBadgeIds.includes(selectedBadge.id) ? 'Badge obtenu !' : 'Pas encore obtenu'}
                </span>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setSelectedBadge(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Badges;
