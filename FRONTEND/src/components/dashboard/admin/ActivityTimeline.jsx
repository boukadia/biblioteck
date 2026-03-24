import React from 'react';

const activities = [
  {
    id: 1,
    type: 'borrow',
    title: 'Ahmad Mohammad a emprunt\u00e9 "L\'Alchimiste"',
    time: 'Il y a 5 minutes',
  },
  {
    id: 2,
    type: 'return',
    title: 'Fatima Ali a retourn\u00e9 "1984"',
    time: 'Il y a 15 minutes',
  },
  {
    id: 3,
    type: 'overdue',
    title: 'Alerte de retard: Khalid - "Les Mis\u00e9rables"',
    time: 'Il y a une heure',
  },
  {
    id: 4,
    type: 'register',
    title: 'Nouvel \u00e9tudiant inscrit: Sarah Ahmed',
    time: 'Il y a 2 heures',
  },
  {
    id: 5,
    type: 'borrow',
    title: 'Mahmoud Abdullah a emprunt\u00e9 "Un nouveau monde"',
    time: 'Il y a 3 heures',
  },
  {
    id: 6,
    type: 'return',
    title: 'Amirah a retourn\u00e9 "Le Petit Prince"',
    time: 'Il y a 4 heures',
  },
];

function ActivityTimeline() {
  return (
    <div className="section-card">
      <div className="section-header">
        <h3>
          <i className="fas fa-stream" style={{ color: 'var(--accent)' }}></i>
          Activit\u00e9 r\u00e9cente
        </h3>
        <a href="#!" className="btn btn-sm btn-outline">Voir tout</a>
      </div>

      <div className="activity-timeline">
        {activities.map((activity) => (
          <div className={`timeline-item ${activity.type}`} key={activity.id}>
            <h5>{activity.title}</h5>
            <span>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityTimeline;