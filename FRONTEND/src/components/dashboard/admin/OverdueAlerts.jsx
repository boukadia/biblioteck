import React, { useState, useEffect } from 'react';
import { retournerLivre } from '../../../services/emprunts.api';

function OverdueAlerts({ empruntsEnRetard }) {
  const [newEmpruntsEnRetard, setNewEmpruntsEnRetard] = useState(empruntsEnRetard || []);

  useEffect(() => {
    setNewEmpruntsEnRetard(empruntsEnRetard || []);
  }, [empruntsEnRetard]);

  async function handleMarkResolved(id) {
    try {
      await retournerLivre(id);
      setNewEmpruntsEnRetard(newEmpruntsEnRetard.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error('Error resolving overdue:', error);
    }
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>
          <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger)' }}></i>
          Alertes de retard
          <span className="count" style={{ background: 'var(--danger)' }}>
            {newEmpruntsEnRetard.length}
          </span>
        </h3>
        <a href="#!" className="btn btn-sm btn-outline">Voir tout</a>
      </div>

      {newEmpruntsEnRetard.map((emp) => (
        <div className={`alert-item danger`} key={emp.id}>
          <div className="alert-icon">
            <i className="fas fa-exclamation"></i>
          </div>
          <div className="alert-content">
            <h5>{emp.utilisateur?.nom} - "{emp.livre?.titre}"</h5>
            <span>{emp.statut}</span>
          </div>
          <div className="alert-actions">
            <button
              className="action-btn resolve"
              title="Marquer comme résolu"
              onClick={() => handleMarkResolved(emp.id)}
            >
              <i className="fas fa-check"></i>
            </button>
          </div>
        </div>
      ))}
      {newEmpruntsEnRetard.length === 0 && (
        <div className="text-center py-4" style={{ color: 'var(--gray)' }}>
          Aucune alerte de retard
        </div>
      )}
    </div>
  );
}

export default OverdueAlerts;