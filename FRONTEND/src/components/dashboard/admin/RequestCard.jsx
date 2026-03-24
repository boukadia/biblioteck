import React from 'react';
import { annule, validerEmprunt } from '../../../services/emprunts.api';

const generateGradient = (str) => {
  const colors = [
    ['#6366f1', '#f59e0b'],
    ['#f093fb', '#f5576c'],
    ['#ef4444', '#dc2626'],
    ['#11998e', '#38ef7d'],
    ['#667eea', '#764ba2'],
    ['#4facfe', '#00f2fe'],
  ];
  let hash = 0;
  for (let i = 0; i < str?.length || 0; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
  return date.toLocaleDateString('fr-FR');
};

function RequestCard({ request, isSelected, onSelect, onApprove, onReject }) {
  const {
    id,
    utilisateur: user,
    livre: book,
    dateEmprunt
  } = request;

  const userInitials = user?.initials || user?.nom?.substring(0, 2).toUpperCase() || '??';
  const userName = user?.nom || 'Utilisateur inconnu';
  const userLevel = user?.niveau || 1;
  const userLevelIcon = userLevel >= 8 ? '👑' : (userLevel >= 4 ? '⭐' : '📖');
  const userHistoryStatus = userLevel >= 7 ? 'good' : (userLevel >= 4 ? 'medium' : 'bad');
  
  return (
    <div className={`request-card ${isSelected ? 'selected' : ''}`}>
      <div className="request-header">
        <input
          type="checkbox"
          className="request-checkbox"
          checked={isSelected}
          onChange={() => onSelect(id)}
        />
        <span className="status-badge pending">En attente d'approbation</span>
      </div>
      
      <div className="request-body">
        <div className="request-user">
          <div 
            className="user-avatar-sm" 
            style={{ background: generateGradient(userName) }}
          >
            {userInitials}
          </div>
          <div>
            <h5>{userName}</h5>
            <div className="user-level">{userLevelIcon} Niveau {userLevel}</div>
            <div className={`user-history ${userHistoryStatus}`}>
              {userHistoryStatus === 'good' ? '✓' : '⚠'} {userLevel >= 6 ? 'Excellent historique' : 'Historique standard'}
            </div>
            
          </div>
        </div>

        <div className="request-book">
          <div 
            className="book-cover-sm" 
            style={{ background: generateGradient(book?.titre || 'book') }}
          ></div>
          <div>
            <h5>{book?.titre || 'Sans titre'}</h5>
            <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
              {book?.auteur || 'Auteur inconnu'}
            </span>
            <div style={{ marginTop: '0.25rem' }}>
              <span 
                className="status-badge available" 
                style={{ fontSize: '0.7rem' }}
              >
                Disponible
              </span>
            </div>
          </div>
        </div>

        <div className="request-time">
          <span className="time">{formatTimeAgo(dateEmprunt)}</span>
          <span className="date">{dateEmprunt ? new Date(dateEmprunt).toLocaleDateString('fr-FR') : ''}</span>
        </div>

        <div className="request-actions">
          <button
            className="btn btn-sm btn-success"
            onClick={() => onApprove(id)}
          >
            <i className="fas fa-check"></i> Approuver
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onReject(id)}
          >
            <i className="fas fa-times"></i> Refuser
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestCard;