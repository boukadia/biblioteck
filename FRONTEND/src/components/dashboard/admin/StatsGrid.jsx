import React from 'react';

const stats = [
  {
    color: 'purple',
    icon: 'fa-book',
    value: '1,247',
    label: 'Total des livres',
    trend: { direction: 'up', value: '12%' },
  },
  {
    color: 'green',
    icon: 'fa-hand-holding',
    value: '156',
    label: 'Emprunts actifs',
    trend: { direction: 'up', value: '8%' },
  },
  {
    color: 'orange',
    icon: 'fa-clock',
    value: '8',
    label: 'Demandes en attente',
    trend: null,
  },
  {
    color: 'red',
    icon: 'fa-exclamation-triangle',
    value: '23',
    label: 'Emprunts en retard',
    trend: { direction: 'down', value: '5%' },
  },
  {
    color: 'blue',
    icon: 'fa-users',
    value: '892',
    label: 'Étudiants inscrits',
    trend: { direction: 'up', value: '15%' },
  },
];

function StatsGrid() {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className={`stat-card ${stat.color}`} key={index}>
          <div className="stat-header">
            <div className="stat-icon">
              <i className={`fas ${stat.icon}`}></i>
            </div>
            {/* {stat.trend && (
              <span className={`stat-trend ${stat.trend.direction}`}>
                <i className={`fas fa-arrow-${stat.trend.direction}`}></i>{' '}
                {stat.trend.value}
              </span>
            )} */}
          </div>
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;