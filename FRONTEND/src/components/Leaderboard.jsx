import React from 'react';

export default function Leaderboard({ students = [] }) {
    console.log('====================================');
    console.log("stu",students);
    console.log('====================================');
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

  return (
    <section className="leaderboard-section" id="leaderboard">
      <div className="section-header">
        <h2>🏆 <span>Classement des Lecteurs</span></h2>
        <p>Les lecteurs les plus actifs</p>
      </div>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h3><i className="fas fa-crown" style={{ color: 'gold' }}></i> Meilleurs Lecteurs</h3>
        </div>
        <ul className="leaderboard-list">
          {students && students.length > 0 ? (
            students.slice(0, 5).map((item, index) => {
              const rankNumber = index + 1;
              const studentName = item.nom || 'Anonyme';
              const studentPoints = item.xp || 0;
              const studentLevel = item.niveau || 'Lecteur 📖';
              const studentAvatar = item.nom?.substring(0, 2).toUpperCase() || 'ST';

              return (
                <li key={index} className={`leader-item ${getRankClass(rankNumber)}`}>
                  <div className={`leader-rank ${getRankBadgeClass(rankNumber)}`}>
                    {rankNumber}
                  </div>
                  <div className="leader-avatar">{studentAvatar}</div>
                  <div className="leader-info">
                    <h4>{studentName}</h4>
                    <span>Niveau: {studentLevel}</span>
                  </div>
                  <div className="leader-points">
                    <strong>{studentPoints.toLocaleString ? studentPoints.toLocaleString() : studentPoints}</strong>
                    <span>points</span>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="alert alert-info">Aucune donnée de classement disponible</div>
          )}
        </ul>
      </div>
    </section>
  );
}
