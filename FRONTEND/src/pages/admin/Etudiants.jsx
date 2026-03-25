import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/etudiants.css';
import { getAllUsers, changeUserStatus, deleteUser } from '../../services/users.api';

function Etudiants() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeNav, setActiveNav] = useState('etudiants')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [statusLoading, setStatusLoading] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null, name: '', error: null })

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers()
        const etudiants = (data || []).filter(u => u.role === 'ETUDIANT')
        setUsers(etudiants)
        setFilteredUsers(etudiants)
      } catch (error) {
        console.error('Erreur chargement étudiants:', error)
      }
      setIsLoading(false)
    }
    loadUsers()
  }, [])

  // --- Fonctions de filtrage ---

  function handleSearch(value) {
    setSearchQuery(value)
    setFilterLevel('')
    const result = users.filter(u =>
      (u.nom || '').toLowerCase().includes(value.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(value.toLowerCase())
    )
    setFilteredUsers(result)
  }

  function handleFilterLevel(value) {
    setFilterLevel(value)
    setSearchQuery('')
    if (!value) {
      setFilteredUsers(users)
    } else {
      const result = users.filter(u => getLevelInfo(u.niveau).name === value)
      setFilteredUsers(result)
    }
  }

  // --- Actions ---

  async function handleToggleStatus(userId) {
    setStatusLoading(userId)
    try {
      await changeUserStatus(userId)
      const data = await getAllUsers()
      const etudiants = (data || []).filter(u => u.role === 'ETUDIANT')
      setUsers(etudiants)
      setFilteredUsers(etudiants)
    } catch (error) {
      console.error('Erreur changement statut:', error)
    }
    setStatusLoading(null)
  }

  async function handleDelete() {
    try {
      await deleteUser(showDeleteModal.id)
      setShowDeleteModal({ show: false, id: null, name: '', error: null })
      const data = await getAllUsers()
      const etudiants = (data || []).filter(u => u.role === 'ETUDIANT')
      setUsers(etudiants)
      setFilteredUsers(etudiants)
    } catch (error) {
      console.error('Erreur suppression:', error)
      const msg = error.response?.data?.message || 'Erreur lors de la suppression.'
      setShowDeleteModal(prev => ({ ...prev, error: msg }))
    }
  }

  // --- Helpers ---

  function getLevelInfo(niveau) {
    const n = niveau || 1
    if (n >= 8) return { name: 'Maître', icon: '👑', css: 'diamond' }
    if (n >= 6) return { name: 'Expert', icon: '⭐', css: 'gold' }
    if (n >= 4) return { name: 'Avancé', icon: '⭐', css: 'silver' }
    if (n >= 2) return { name: 'Intermédiaire', icon: '📖', css: 'bronze' }
    return { name: 'Débutant', icon: '📖', css: 'bronze' }
  }

  function getInitials(nom) {
    return (nom || '??').substring(0, 2).toUpperCase()
  }

  // --- Stats ---
  const totalEtudiants = users.length
  const actifs = users.filter(u => u.statut === 'ACTIF').length
  const bloques = users.filter(u => u.statut === 'BLOQUE').length
  const maitres = users.filter(u => (u.niveau || 1) >= 8).length

  return (
    <div className="app-wrapper">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-outline d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1>Gestion des Étudiants 👥</h1>
                <p>Consulter et gérer les comptes étudiants</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterLevel}
              onChange={(e) => handleFilterLevel(e.target.value)}
            >
              <option value="">Tous les niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Expert">Expert</option>
              <option value="Maître">Maître</option>
            </select>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
            </div>
            <h3>{isLoading ? '...' : totalEtudiants}</h3>
            <p>Total étudiants</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-check"></i></div>
            </div>
            <h3>{isLoading ? '...' : actifs}</h3>
            <p>Comptes actifs</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-slash"></i></div>
            </div>
            <h3>{isLoading ? '...' : bloques}</h3>
            <p>Bloqués</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-trophy"></i></div>
            </div>
            <h3>{isLoading ? '...' : maitres}</h3>
            <p>Niveau Maître</p>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
            <p style={{ marginTop: '1rem' }}>Chargement des étudiants...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
            <i className="fas fa-user-slash" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
            <p style={{ marginTop: '1rem' }}>Aucun étudiant trouvé</p>
          </div>
        ) : (
          <div className="students-grid">
            {filteredUsers.map(user => {
              const level = getLevelInfo(user.niveau)
              const initials = getInitials(user.nom)
              const isBlocked = user.statut === 'BLOQUE'

              return (
                <div
                  className="student-card"
                  key={user.id}
                  style={isBlocked ? { borderColor: 'rgba(239, 68, 68, 0.3)' } : {}}
                >
                  {/* Header carte */}
                  <div className="student-header">
                    <div
                      className="student-avatar"
                      style={isBlocked ? { background: 'linear-gradient(135deg, var(--danger), #dc2626)' } : {}}
                    >
                      {initials}
                    </div>
                    <div className="student-info">
                      <h4>{user.nom || 'Sans nom'}</h4>
                      <span className="email">{user.email || '-'}</span>
                      {isBlocked && (
                        <span className="blocked-badge">Bloqué</span>
                      )}
                    </div>
                    <div className="student-level">
                      <div className={`level-badge ${level.css}`}>{level.icon}</div>
                      <span>Niv. {user.niveau || 1}</span>
                    </div>
                  </div>

                  {/* Stats carte */}
                  <div className="student-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="student-stat" style={{ height: 'fit-content' }}>
                      <span className="stu-stat-v" style={{ color: 'var(--secondary)', display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{user.pointsActuels || 0}</span>
                      <span className="stu-stat-l" style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'block' }}>Points</span>
                    </div>
                    <div className="student-stat" style={{ height: 'fit-content' }}>
                      <span className="stu-stat-v" style={{ color: 'var(--primary)', display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{user.xp || 0}</span>
                      <span className="stu-stat-l" style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'block' }}>XP</span>
                    </div>
                    <div className="student-stat" style={{ height: 'fit-content' }}>
                      <span className="stu-stat-v" style={{ color: 'var(--accent)', display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{user.niveau || 1}</span>
                      <span className="stu-stat-l" style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'block' }}>Niveau</span>
                    </div>
                    <div className="student-stat" style={{ height: 'fit-content' }}>
                      <span className="stu-stat-v" style={{ color: isBlocked ? 'var(--danger)' : 'var(--accent)', display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>
                        {isBlocked ? 'Bloqué' : 'Actif'}
                      </span>
                      <span className="stu-stat-l" style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'block' }}>Statut</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="student-actions">
                    <button
                      className={`btn btn-sm ${isBlocked ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={statusLoading === user.id}
                    >
                      {statusLoading === user.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : isBlocked ? (
                        <><i className="fas fa-unlock"></i> Débloquer</>
                      ) : (
                        <><i className="fas fa-ban"></i> Bloquer</>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setShowDeleteModal({ show: true, id: user.id, name: user.nom, error: null })}
                    >
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal Suppression */}
      {showDeleteModal.show && (
        <div className="modal-overlay active" onClick={() => setShowDeleteModal({ show: false, id: null, name: '', error: null })}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger)' }}></i> Confirmation
              </h2>
              <button className="close-modal" onClick={() => setShowDeleteModal({ show: false, id: null, name: '', error: null })}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              {showDeleteModal.error ? (
                <p style={{ color: 'var(--danger)', padding: '1rem 0' }}>{showDeleteModal.error}</p>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '0.75rem' }}>
                    <i className="fas fa-user-times"></i>
                  </div>
                  <p style={{ color: 'var(--light)' }}>
                    Supprimer <strong>{showDeleteModal.name}</strong> ?
                  </p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                    Cette action est irréversible.
                  </p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal({ show: false, id: null, name: '', error: null })}>
                Annuler
              </button>
              {!showDeleteModal.error && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  <i className="fas fa-trash"></i> Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Etudiants;
