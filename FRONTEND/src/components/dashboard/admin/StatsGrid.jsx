import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../../services/stats.api';



function StatsGrid({stats}) {
  // const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  
  const updatedStats = [
  {
    color: 'purple',
    icon: 'fa-book',
    value: stats.totalLivres,
    label: 'totalLivres',
  },
  {
    color: 'green',
    icon: 'fa-hand-holding',
    value: stats.empruntsActifs,
    label: 'empruntsActifs',
  },
  {
    color: 'orange',
    icon: 'fa-clock',
    value: stats.demandesEnAttente,
    label: 'demandesEnAttente',
  },
  {
    color: 'red',
    icon: 'fa-exclamation-triangle',
    value: stats.empruntsEnRetard,
    label: 'empruntsEnRetard',
  },
  {
    color: 'blue',
    icon: 'fa-users',
    value: stats.totalEtudiants,
    label: 'totalEtudiants',
  },
];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        
        // if (data && Array.isArray(data)) {
        //   const updatedStats = defaultStats.map((stat) => {
        //     const apiStat = data.find(s => s.label.toLowerCase() === stat.label.toLowerCase());
        //     return apiStat ? { ...stat, value: apiStat.value } : stat;
        //   });
        //   setStats(updatedStats);
        // }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  

  return (
    <div className="stats-grid">
      {updatedStats.map((stat, index) => (
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
          <h3>{loading ? '...' : stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;