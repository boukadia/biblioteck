import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/etudiant/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/studentPages.css';
import { getLeaderboard, getUserById } from '../../services/users.api';

function Leaderboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUserId(storedUser.id || null);
      if (storedUser.id) {
        const u = await getUserById(storedUser.id);
        if (u) {
          setUser(u);
        }
      }
      const data = await getLeaderboard();
      setPlayers(data || []);
    } catch (error) {
      console.error('Erreur chargement leaderboard:', error);
    }
    setIsLoading(false);
  }

  function getMedalIcon(rank) {
    if (rank === 1) {
      return { icon: 'fa-crown', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    }
    if (rank === 2) {
      return { icon: 'fa-medal', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
    }
    if (rank === 3) {
      return { icon: 'fa-medal', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)' };
    }
    return { icon: 'fa-hashtag', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' };
  }

  const myRank = players.findIndex(p => p.id === currentUserId) + 1;

  return (
    <div className="app-wrapper">
      <Sidebar
        activePage="leaderboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user.nom}
        userLevel={user.niveau}
      />

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1>Classement 🏆</h1>
                <p>Découvrez les meilleurs lecteurs</p>
              </div>
            </div>
          </div>
        </header>

        {/* My Rank Card */}
        {myRank > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem',
            display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'white'
            }}>
              #{myRank}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Votre classement</h3>
              <p style={{ color: '#94a3b8', margin: 0 }}>
                Vous êtes classé <strong style={{ color: '#6366f1' }}>#{myRank}</strong> sur {players.length} lecteurs
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{user.points || 0}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Points</div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement du classement...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="empty-emprunts">
            <i className="fas fa-trophy" style={{ display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem' }}>Aucun classement disponible.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {players.map((player, index) => {
              const rank = index + 1;
              const medal = getMedalIcon(rank);
              const isMe = player.id === currentUserId;

              return (
                <div key={player.id} style={{
                  background: isMe
                    ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))'
                    : 'linear-gradient(145deg, #1e293b, #0f172a)',
                  borderRadius: '14px', padding: '1rem 1.25rem',
                  border: isMe ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  transition: 'all 0.3s'
                }}>
                  {/* Rank */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: medal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: rank <= 3 ? '1.2rem' : '0.9rem', color: medal.color, fontWeight: 700, flexShrink: 0
                  }}>
                    {rank <= 3 ? <i className={`fas ${medal.icon}`}></i> : `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: `linear-gradient(135deg, hsl(${(index * 47) % 360}, 70%, 55%), hsl(${(index * 47 + 40) % 360}, 70%, 45%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                  }}>
                    {(player.nom || '??').substring(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '0.95rem' }}>
                      {player.nom || 'Anonyme'} {player.prenom || ''}
                      {isMe && <span style={{ color: '#6366f1', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Vous)</span>}
                    </h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.8rem' }}>
                      Niveau {player.niveau || 1}
                    </p>
                  </div>

                  {/* Points */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: rank <= 3 ? medal.color : '#f8fafc' }}>
                      {player.xp || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Leaderboard;
