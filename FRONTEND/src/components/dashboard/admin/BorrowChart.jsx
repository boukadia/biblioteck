import React from 'react';

const chartData = [
  { label: 'Jan', borrows: 45, returns: 38 },
  { label: 'Feb', borrows: 62, returns: 55 },
  { label: 'Mar', borrows: 78, returns: 70 },
  { label: 'Apr', borrows: 55, returns: 48 },
  { label: 'May', borrows: 90, returns: 82 },
  { label: 'Jun', borrows: 72, returns: 65 },
  { label: 'Jul', borrows: 40, returns: 35 },
  { label: 'Aug', borrows: 30, returns: 28 },
  { label: 'Sep', borrows: 85, returns: 78 },
  { label: 'Oct', borrows: 95, returns: 88 },
  { label: 'Nov', borrows: 70, returns: 60 },
  { label: 'Dec', borrows: 50, returns: 45 },
];

function BorrowChart() {
  const maxVal = Math.max(...chartData.map((d) => d.borrows));

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>
          <i className="fas fa-chart-bar" style={{ color: 'var(--primary)' }}></i>
          Statistiques d'emprunt
        </h3>
        <div className="section-actions">
          <select className="filter-select">
            <option>Cette ann\u00e9e</option>
            <option>L'ann\u00e9e derni\u00e8re</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="chart-bar"
            style={{ height: `${(item.borrows / maxVal) * 100}%` }}
            data-value={item.borrows}
          >
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'var(--primary)' }}></div>
          Emprunts
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'var(--accent)' }}></div>
          Retours
        </div>
      </div>
    </div>
  );
}

export default BorrowChart;