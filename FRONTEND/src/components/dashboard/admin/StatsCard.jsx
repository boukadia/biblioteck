import React from 'react';

function StatsCard({ stats }) {
  const updatedStats = [
    {
      color: 'orange',
      icon: 'fa-clock',
      value: stats?.demandesEnAttente || '0',
      label: 'Demandes en attente',
    },
    {
      color: 'green',
      icon: 'fa-check',
      value: stats?.empruntsActifs || '0',
      label: "Approuvées",
    },
    {
      color: 'red',
      icon: 'fa-times',
      value: stats?.empruntsAnnules || '0',
      label: "Refusées",
    },
  ];

  return (
    <>
      {updatedStats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-header">
            <div className="stat-icon">
              <i className={`fas ${stat.icon}`}></i>
            </div>
          </div>
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </>
  );
}

export default StatsCard;