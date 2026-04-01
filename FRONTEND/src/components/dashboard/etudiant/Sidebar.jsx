import React from 'react';
import { useNavigate } from 'react-router-dom';

const navSections = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Tableau de bord', path: '/Etudiant' },
      { id: 'bibliotheque', icon: 'fa-book-open', label: 'Bibliothèque', path: '/livres' },
    ],
  },
  {
    title: 'Mes Emprunts',
    items: [
      { id: 'emprunts-actifs', icon: 'fa-book-reader', label: 'Emprunts actifs', path: '/mes-emprunts' },
      { id: 'historique', icon: 'fa-history', label: 'Historique', path: '/historique' },
    ],
  },
  {
    title: 'Gamification',
    items: [
      { id: 'badges', icon: 'fa-medal', label: 'Mes Badges', path: '/badges' },
      { id: 'boutique', icon: 'fa-store', label: 'Boutique', path: '/boutique' },
      { id: 'leaderboard', icon: 'fa-trophy', label: 'Classement', path: '/leaderboard' },
    ],
  },
  {
    title: 'Profil',
    items: [
      { id: 'wishlist', icon: 'fa-heart', label: 'Liste de souhaits', path: '/wishlist' },
      // { id: 'parametres', icon: 'fa-cog', label: 'Paramètres', path: '/parametres' },
    ],
  },
];

function Sidebar({ activePage, isOpen, onClose, userName, userLevel }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/Etudiant')} style={{ cursor: 'pointer' }}>
          <i className="fas fa-book-open"></i>
          <span>BiblioTech</span>
        </div>
        <span className="admin-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' }}>
          <i className="fas fa-user-graduate"></i> Espace Étudiant
        </span>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div className="nav-section" key={section.title}>
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    if (onClose) onClose();
                  }}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`badge ${item.badgeType || ''}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="nav-section">
            <div className="nav-item text-danger" onClick={handleLogout} style={{ marginTop: 'auto', cursor: 'pointer', color: 'var(--danger)' }}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Déconnexion</span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-card">
            <div className="admin-avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              {(userName || '??').substring(0, 2).toUpperCase()}
            </div>
            <div className="admin-info">
              <h4>{userName || 'Étudiant'}</h4>
              <span>Niveau {userLevel || 1}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
