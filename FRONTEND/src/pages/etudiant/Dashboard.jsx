import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import { getMesEmprunts } from '../../services/emprunts.api';
import { getUserById } from '../../services/users.api';

function StudentDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [user, setUser] = useState({});
  const [emprunts, setEmprunts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log('====================================');
  console.log(user);
  console.log('====================================');

  const fetchUser = async (userId) => {
    try {
      const fetchedUser = await getUserById(userId);
      if (fetchedUser) setUser(fetchedUser);
    } catch (error) {
      console.error('Erreur fetch user:', error);
    }
  };

  const fetchEmprunts = async () => {
    try {
      const data = await getMesEmprunts();
      setEmprunts(data || []);
    } catch (error) {
      console.error('Erreur fetch emprunts:', error);
    }
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
     
      const userId = storedUser.id 

      if (userId) {
        try {
          const fetchedUser = await getUserById(userId);
         
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            setUser(storedUser);
          }
        } catch (error) {
          console.error('Erreur lors du refresh des données utilisateur:', error);
          setUser(storedUser);
        }
      }

      await fetchEmprunts();
      setIsLoading(false);
    }
    loadData();
  }, []);
console.log('====================================');
console.log(user);
console.log('====================================');
  const getLevelInfo = (niveau) => {
    const n = niveau || 1;
    if (n >= 8) return { name: 'Maître', icon: '👑', css: 'diamond' };
    if (n >= 6) return { name: 'Expert', icon: '⭐', css: 'gold' };
    if (n >= 4) return { name: 'Avancé', icon: '⭐', css: 'silver' };
    if (n >= 2) return { name: 'Intermédiaire', icon: '📖', css: 'bronze' };
    return { name: 'Débutant', icon: '📖', css: 'bronze' };
  };

  const levelInfo = getLevelInfo(user.niveau);

  // Computations for widgets
  const activeLoans = emprunts.filter(e => ['EN_ATTENTE', 'EN_COURS'].includes(e.statut));
  const retards = emprunts.filter(e => e.statut === 'EN_RETARD');
  const finished = emprunts.filter(e => ['RETOURNE'].includes(e.statut));
  

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user.nom}
        userLevel={user.niveau}
      />

      <main className="main-content">
        {/* Header content */}
        <header className="header">
          <div className="header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1>Bonjour, {user.nom || 'Étudiant'} 👋</h1>
                <p>Bienvenue sur votre espace BiblioTech</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="level-badge-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.5rem' }}>{levelInfo.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Niveau {user.niveau || 1}</span>
                <strong style={{ color: 'var(--light)', fontSize: '0.9rem' }}>{levelInfo.name}</strong>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => window.location.href='/livres'}>
              <i className="fas fa-book"></i> Découvrir
            </button>
          </div>
        </header>

        {/* Gamification Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-star"></i></div>
            </div>
            <h3>{isLoading ? '...' : (user.xp || 3)}</h3>
            <p>Points d'Expérience (XP)</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-coins"></i></div>
            </div>
            <h3>{isLoading ? '...' : (user.pointsActuels || 0)}</h3>
            <p>Points de Récompense</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-book-reader"></i></div>
            </div>
            <h3>{isLoading ? '...' : activeLoans.length}</h3>
            <p>Emprunts Actifs</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-exclamation-circle"></i></div>
            </div>
            <h3>{isLoading ? '...' : retards.length}</h3>
            <p>Retards ({retards.length > 0 ? "Pénalité!" : "Parfait!"})</p>
          </div>
        </div>

        {/* Emprunts Actifs */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}><i className="fas fa-book-open" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> Mes Emprunts en cours</h3>
              <button className="btn btn-sm btn-outline" onClick={() => window.location.href='/mes-emprunts'}>
                Voir tout
              </button>
            </div>
            <div className="table-container">
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                  <p style={{ marginTop: '1rem' }}>Chargement de vos emprunts...</p>
                </div>
              ) : activeLoans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                  <i className="fas fa-box-open" style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}></i>
                  <p>Vous n'avez aucun emprunt en cours.</p>
                  <button className="btn btn-sm btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href='/livres'}>Trouver un livre</button>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Livre</th>
                      <th>Date d'emprunt</th>
                      <th>Date de retour prévue</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map(emprunt => {
                      let statusClass = "badge-success";
                      let statusText = "En cours";
                      if (emprunt.statut === "EN_ATTENTE") {
                        statusClass = "badge-warning";
                        statusText = "En attente";
                      }
                      return (
                        <tr key={emprunt.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: '40px', height: '60px', borderRadius: '4px', backgroundImage: `url(${emprunt.livre?.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                              <div>
                                <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--light)' }}>{emprunt.livre?.titre}</h5>
                                <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{emprunt.livre?.auteur}</span>
                              </div>
                            </div>
                          </td>
                          <td>{new Date(emprunt.dateEmprunt).toLocaleDateString()}</td>
                          <td>{new Date(emprunt.dateEcheance).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${statusClass}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>{statusText}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
