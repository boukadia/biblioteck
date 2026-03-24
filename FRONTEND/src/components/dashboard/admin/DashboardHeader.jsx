import React, { useState } from 'react';

function DashboardHeader({ onAddBook, onToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="header">
      <div className="header-title">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline d-lg-none"
            onClick={onToggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue! Voici le résumé du jour</p>
          </div>
        </div>
      </div>
      <div className="header-actions">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Recherche rapide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="icon-btn">
          <i className="fas fa-bell"></i>
          <span className="badge-dot">12</span>
        </button>
        <button className="btn btn-primary" onClick={onAddBook}>
          <i className="fas fa-plus"></i>
          Ajouter un livre
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;