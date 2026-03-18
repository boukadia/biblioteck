import React from 'react';

function QuickActions({ onAddBook }) {
  const actions = [
    {
      type: 'add-book',
      icon: 'fa-plus',
      title: 'Ajouter un nouveau livre',
      subtitle: 'Ajouter un livre à la bibliothèque',
      onClick: onAddBook,
    },
    {
      type: 'approve',
      icon: 'fa-check-double',
      title: 'Approuver les demandes',
      subtitle: '8 demandes en attente',
      onClick: () => {},
    },
    {
      type: 'returns',
      icon: 'fa-undo',
      title: 'Traiter les retours',
      subtitle: 'Enregistrer les retours de livres',
      onClick: () => {},
    },
    {
      type: 'alerts',
      icon: 'fa-bell',
      title: 'Alertes urgentes',
      subtitle: '5 nouvelles alertes',
      onClick: () => {},
    },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <div
          className={`action-card ${action.type}`}
          key={index}
          onClick={action.onClick}
        >
          <div className="action-icon">
            <i className={`fas ${action.icon}`}></i>
          </div>
          <div className="action-info">
            <h4>{action.title}</h4>
            <span>{action.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuickActions;