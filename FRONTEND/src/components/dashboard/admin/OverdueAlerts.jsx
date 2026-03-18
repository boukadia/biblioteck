import React from 'react';

const alerts = [
  {
    id: 1,
    type: 'danger',
    icon: 'fa-exclamation',
    title: 'Khalid Abdullah - "Le Feu"',
    subtitle: 'Une action imm\u00e9diate s\'impose',
    days: 15,
  },
  {
    id: 2,
    type: 'danger',
    icon: 'fa-exclamation',
    title: 'Sarah Ahmed - "Le Petit Prince"',
    subtitle: 'Rappel envoy\u00e9',
    days: 10,
  },
];

function OverdueAlerts() {
  return (
    <div className="section-card">
      <div className="section-header">
        <h3>
          <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger)' }}></i>
          Alertes de retard
          <span className="count" style={{ background: 'var(--danger)' }}>
            {alerts.length}
          </span>
        </h3>
        <a href="#!" className="btn btn-sm btn-outline">Voir tout</a>
      </div>

      {alerts.map((alert) => (
        <div className={`alert-item ${alert.type === 'warning' ? 'warning' : ''}`} key={alert.id}>
          <div className="alert-icon">
            <i className={`fas ${alert.icon}`}></i>
          </div>
          <div className="alert-content">
            <h5>{alert.title}</h5>
            <span>{alert.subtitle}</span>
          </div>
          <div className="alert-days">
            <strong>{alert.days}</strong>
            <span>jours de retard</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OverdueAlerts;