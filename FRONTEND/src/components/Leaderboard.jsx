import React, { useState } from 'react';

const leaderboardData = {
  week: [
    { rank: 1, name: 'Ahmed Mohamed', avatar: 'AM', level: 'Maître des Livres 💎', points: 12450 },
    { rank: 2, name: 'Fatima Ali', avatar: 'FA', level: 'Lecteur Légendaire 👑', points: 10230 },
    { rank: 3, name: 'Omar Hassan', avatar: 'OH', level: 'Lecteur Étoile ⭐', points: 8750 },
    { rank: 4, name: 'Sarah Ahmed', avatar: 'SA', level: 'Lecteur Étoile ⭐', points: 7420 },
    { rank: 5, name: 'Khalid Abdullah', avatar: 'KA', level: 'Lecteur Enthousiaste 📖', points: 5180 },
  ],
  month: [
    { rank: 1, name: 'Fatima Ali', avatar: 'FA', level: 'Lecteur Légendaire 👑', points: 25450 },
    { rank: 2, name: 'Ahmed Mohamed', avatar: 'AM', level: 'Maître des Livres 💎', points: 23180 },
    { rank: 3, name: 'Omar Hassan', avatar: 'OH', level: 'Lecteur Étoile ⭐', points: 18750 },
    { rank: 4, name: 'Sarah Ahmed', avatar: 'SA', level: 'Lecteur Étoile ⭐', points: 17420 },
    { rank: 5, name: 'Khalid Abdullah', avatar: 'KA', level: 'Lecteur Enthousiaste 📖', points: 15180 },
  ],
  allTime: [
    { rank: 1, name: 'Ahmed Mohamed', avatar: 'AM', level: 'Maître des Livres 💎', points: 125450 },
    { rank: 2, name: 'Fatima Ali', avatar: 'FA', level: 'Lecteur Légendaire 👑', points: 102300 },
    { rank: 3, name: 'Omar Hassan', avatar: 'OH', level: 'Lecteur Étoile ⭐', points: 87500 },
    { rank: 4, name: 'Sarah Ahmed', avatar: 'SA', level: 'Lecteur Étoile ⭐', points: 74200 },
    { rank: 5, name: 'Khalid Abdullah', avatar: 'KA', level: 'Lecteur Enthousiaste 📖', points: 51800 },
  ],
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('week');

  const getRankClass = (rank) => {
    if (rank === 1) return 'top-1';
    if (rank === 2) return 'top-2';
    if (rank === 3) return 'top-3';
    return '';
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
  };

  const currentData = leaderboardData[activeTab];

  return (
    <section className="leaderboard-section" id="leaderboard">
      <div className="section-header">
        <h2>🏆 <span>Classement des Lecteurs</span></h2>
        <p>Les lecteurs les plus actifs ce mois-ci</p>
      </div>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h3><i className="fas fa-crown" style={{ color: 'gold' }}></i> Meilleurs Lecteurs</h3>
          <div className="leaderboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'week' ? 'active' : ''}`}
              onClick={() => setActiveTab('week')}
            >
              Cette Semaine
            </button>
            <button 
              className={`tab-btn ${activeTab === 'month' ? 'active' : ''}`}
              onClick={() => setActiveTab('month')}
            >
              Ce Mois
            </button>
            <button 
              className={`tab-btn ${activeTab === 'allTime' ? 'active' : ''}`}
              onClick={() => setActiveTab('allTime')}
            >
              Tous les Temps
            </button>
          </div>
        </div>
        <ul className="leaderboard-list">
          {currentData.map((item) => (
            <li key={item.rank} className={`leader-item ${getRankClass(item.rank)}`}>
              <div className={`leader-rank ${getRankBadgeClass(item.rank)}`}>
                {item.rank}
              </div>
              <div className="leader-avatar">{item.avatar}</div>
              <div className="leader-info">
                <h4>{item.name}</h4>
                <span>Niveau: {item.level}</span>
              </div>
              <div className="leader-points">
                <strong>{item.points.toLocaleString()}</strong>
                <span>points</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
