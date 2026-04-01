import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import { getMesEmprunts } from '../../services/emprunts.api';
import { getUserById } from '../../services/users.api';
import { getMesBadges } from '../../services/badges.api';
import { getRecompenses } from '../../services/shop.api';
import { getMaListe } from '../../services/wishList.api';

function StudentDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState({});
  const [emprunts, setEmprunts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
 

  async function fetchWichList() {
    try {
      const list = await getMaListe()
      if (list) {
        setWishlist(list)
      }

    } catch (error) {
      console.error('Erreur fetch wishList:', error);
    }



  }

  const fetchEmprunts = async () => {
    try {
      const data = await getMesEmprunts();
      setEmprunts(data || []);
    } catch (error) {
      console.error('Erreur fetch emprunts:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const badgesData = await getMesBadges();
      setBadges(badgesData || []);
    } catch (error) {
      console.error('Erreur fetch badges:', error);
    }
  };

  const fetchShopItems = async () => {
    try {
      const shopData = await getRecompenses();
      setShopItems(shopData || []);
    } catch (error) {
      console.error('Erreur fetch shop items:', error);
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
            // if(fetchedUser.listeSouhaits) setWishlist(fetchedUser.listeSouhaits);
          } else {
            setUser(storedUser);
          }
        } catch (error) {
          console.error('Erreur lors du refresh des données utilisateur:', error);
          setUser(storedUser);
        }
      }

      await fetchEmprunts();
      await fetchBadges();
      await fetchShopItems();
      await fetchWichList()

      setIsLoading(false);
    }
    loadData();
  }, []);
  
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
            <button className="btn btn-primary" onClick={() => window.location.href = '/livres'}>
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
            <h3>{isLoading ? '...' : (user.xp || 0)}</h3>
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

        {/* Emprunts Actifs & Badges & Shop */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', display: 'grid' }}>
          {/* Colonne Gauche (Emprunts + Badges) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Mes Emprunts en cours */}
            <div className="dashboard-card" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--light)' }}><i className="fas fa-book-open" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> Mes Emprunts en cours</h3>
                <button className="btn btn-sm btn-outline" onClick={() => window.location.href = '/mes-emprunts'}>
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
                    <button className="btn btn-sm btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/livres'}>Trouver un livre</button>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr style={{ color: 'var(--gray)' }}>
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
                            <td style={{ color: 'var(--light)' }}>{new Date(emprunt.dateEmprunt).toLocaleDateString("fr-FR")}</td>
                            <td style={{ color: 'var(--light)' }}>{new Date(emprunt.dateEcheance).toLocaleDateString("fr-FR")}</td>
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

            {/* Badges Section */}
            <div className="dashboard-card" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--light)' }}><i className="fas fa-medal"></i> Mes Badges</h3>
                <a href="/badges" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Voir tout</a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem' }}>
                {badges.length > 0 ? (
                  badges.slice(0, 6).map((b, index) => (
                    <div key={b.id || index} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', transition: 'all 0.3s' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(218, 165, 32, 0.3))', color: '#ffd700' }}>
                        {b.badge?.image || '🌟'}
                      </div>
                      <h5 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--light)' }}>{b.badge?.nom || 'Badge'}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Obtenu</span>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '1rem', color: 'var(--gray)' }}>
                    Aucun badge pour le moment
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Droite (Boutique + Wishlist) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Virtual Shop */}
            <div className="dashboard-card" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--light)' }}><i className="fas fa-store"></i> Boutique</h3>
                <a href="/boutique" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Visiter la boutique</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                {shopItems.length > 0 ? (
                  shopItems.slice(0, 3).map((item, index) => (
                    <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', transition: 'all 0.3s' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))', color: 'var(--secondary)' }}>
                        {item.type === 'PROLONGATION' ? '🃏' : '💳'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ marginBottom: '0.25rem', fontSize: '1rem', color: 'var(--light)' }}>{item.nom}</h5>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{item.description}</span>
                      </div>
                      <div style={{ background: 'linear-gradient(135deg, var(--primary), #4f46e5)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>{item.cout} 💰</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--gray)' }}>
                    Boutique vide
                  </div>
                )}
              </div>
            </div>

            {/* Wishlist */}
            <div className="dashboard-card" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--light)' }}><i className="fas fa-heart"></i> Liste de souhaits</h3>
                <a href="/wishlist" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Voir tout</a>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {wishlist && wishlist.length > 0 ? (
                  wishlist.slice(0, 3).map((w, index) => (
                    <div key={w.id || index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '0.75rem' }}>
                      <div style={{ width: '45px', height: '65px', borderRadius: '8px', backgroundImage: `url(${w.livre?.image})`, backgroundSize: 'cover', backgroundPosition: 'center', background: w.livre?.image ? 'none' : 'linear-gradient(135deg,#a8edea,#fed6e3)' }}></div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--light)' }}>{w.livre?.titre || 'Livre Inconnu'}</h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{w.livre?.auteur || 'Auteur inconnu'}</span>
                      </div>
                      <span style={{ padding: '0.3rem 0.75rem', borderRadius: '15px', fontSize: '0.7rem', fontWeight: '600', background: w.livre?.stock > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: w.livre?.stock > 0 ? 'var(--accent)' : 'var(--danger)' }}>
                        {w.livre?.stock > 0 ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--gray)' }}>
                    Votre liste est vide
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
