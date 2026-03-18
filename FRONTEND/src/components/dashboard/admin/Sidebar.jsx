import React from 'react';

const navSections = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Tableau de bord' },
      { id: 'statistics', icon: 'fa-chart-line', label: 'Statistiques' },
    ],
  },
  {
    title: 'Biblioth\u00e8que',
    items: [
      { id: 'books', icon: 'fa-book', label: 'G\u00e9rer les livres' },
      { id: 'categories', icon: 'fa-layer-group', label: 'Cat\u00e9gories' },
      { id: 'inventory', icon: 'fa-box', label: 'Inventaire', badge: '12', badgeType: 'warning' },
    ],
  },
  {
    title: 'Emprunts',
    items: [
      { id: 'requests', icon: 'fa-hand-holding', label: 'Demandes d\'emprunt', badge: '8' },
      { id: 'active-loans', icon: 'fa-exchange-alt', label: 'Emprunts actifs' },
      { id: 'overdue', icon: 'fa-exclamation-triangle', label: 'En retard', badge: '5' },
      { id: 'history', icon: 'fa-history', label: 'Historique' },
    ],
  },
  {
    title: 'Utilisateurs',
    items: [
      { id: 'students', icon: 'fa-users', label: 'G\u00e9rer les \u00e9tudiants' },
      { id: 'blocked', icon: 'fa-user-slash', label: 'Comptes bloqu\u00e9s', badge: '3' },
      { id: 'leaderboard', icon: 'fa-trophy', label: 'Classement' },
    ],
  },
  {
    title: 'Syst\u00e8me',
    items: [
      { id: 'settings', icon: 'fa-cog', label: 'Param\u00e8tres' },
      { id: 'reports', icon: 'fa-file-alt', label: 'Rapports' },
      { id: 'logout', icon: 'fa-sign-out-alt', label: 'D\u00e9connexion' },
    ],
  },
];

function Sidebar({ activeNav, setActiveNav, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <i className="fas fa-book-open"></i>
          <span>BiblioTech</span>
        </div>
        <span className="admin-badge">
          <i className="fas fa-shield-alt"></i> Panneau d'administration
        </span>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div className="nav-section" key={section.title}>
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <a
                  href="#!"
                  key={item.id}
                  className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(item.id);
                    onClose();
                  }}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`badge ${item.badgeType || ''}`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-card">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <h4>Admin User</h4>
              <span>System Administrator</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;