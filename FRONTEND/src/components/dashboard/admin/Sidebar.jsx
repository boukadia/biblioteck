import React from 'react';
import { useNavigate } from 'react-router-dom';

const navSections = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Tableau de bord', path: '/admin' },
    ],
  },
  {
    title: 'Biblioth\u00e8que',
    items: [
      { id: 'books', icon: 'fa-book', label: 'G\u00e9rer les livres', path: '/admin/livres' },
      { id: 'categories', icon: 'fa-tags', label: 'Cat\u00e9gories', path: '/admin/categories' },
    ],
  },
  {
    title: 'Emprunts',
    items: [
      { id: 'loan-requests', icon: 'fa-hand-holding', label: 'Demandes d\'emprunt', path: '/admin/emprunts' },
      { id: 'pending-return-loans', icon: 'fa-clipboard-check', label: 'En attente retour', path: '/admin/emprunts-en-attente-retour' },
      { id: 'overdue-loans', icon: 'fa-exclamation-triangle', label: 'En retard', path: '/admin/retards' },
      { id: 'all-loans', icon: 'fa-history', label: 'Tous les emprunts', path: '/admin/tous-les-emprunts' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'users', icon: 'fa-users-cog', label: 'Utilisateurs', path: '/admin/users' },
    ],
  },
];

function Sidebar({ activePage, isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
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