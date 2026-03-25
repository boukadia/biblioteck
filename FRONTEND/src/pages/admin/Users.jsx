import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import '../../styles/dashboardAdmin.css';
import '../../styles/users.css';
import { getAllUsers, changeUserStatus, deleteUser } from '../../services/users.api';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null, name: '', error: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3 fonctions simples pour filtrer ---

  const handleSearch = (value) => {
    setSearchQuery(value);
    const result = users.filter(u =>
      (u.nom || '').toLowerCase().includes(value.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(result);
    setFilterRole('');
    setFilterStatus('');
  };

  const handleFilterRole = (value) => {
    setFilterRole(value);
    setSearchQuery('');
    setFilterStatus('');
    if (!value) {
      setFilteredUsers(users);
    } else {
      const result = users.filter(u => u.role === value);
      setFilteredUsers(result);
    }
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setSearchQuery('');
    setFilterRole('');
    if (!value) {
      setFilteredUsers(users);
    } else {
      const result = users.filter(u => u.statut === value);
      setFilteredUsers(result);
    }
  };

  // --- Actions ---

  const handleChangeStatus = async (userId) => {
    setStatusLoading(userId);
    try {
      await changeUserStatus(userId);
      await loadUsers();
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(showDeleteModal.id);
      setShowDeleteModal({ show: false, id: null, name: '', error: null });
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const msg = error.response?.data?.message || 'Erreur lors de la suppression.';
      setShowDeleteModal(prev => ({ ...prev, error: msg }));
    }
  };

  // --- Stats ---
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.statut === 'ACTIF').length;
  const blockedUsers = users.filter(u => u.statut === 'BLOQUE').length;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;

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
                <h1>Gestion des Utilisateurs 👥</h1>
                <p>Gérer les comptes et les accès</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card purple">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
            </div>
            <h3>{totalUsers}</h3>
            <p>Total utilisateurs</p>
          </div>
          <div className="stat-card green">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-check"></i></div>
            </div>
            <h3>{activeUsers}</h3>
            <p>Actifs</p>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-slash"></i></div>
            </div>
            <h3>{blockedUsers}</h3>
            <p>Bloqués</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-header">
              <div className="stat-icon"><i className="fas fa-user-shield"></i></div>
            </div>
            <h3>{adminUsers}</h3>
            <p>Administrateurs</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="section-card">
          <div className="section-header">
            <h3><i className="fas fa-users" style={{ color: '#6366f1' }}></i> Liste des Utilisateurs</h3>
          </div>

          {/* Filters */}
          <div className="users-filters">
            <input
              type="text"
              className="filter-select"
              placeholder="🔍 Rechercher..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ flex: 1, minWidth: '180px' }}
            />
            <select className="filter-select" value={filterRole} onChange={(e) => handleFilterRole(e.target.value)}>
              <option value="">Tous les rôles</option>
              <option value="ETUDIANT">Étudiants</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
            <select className="filter-select" value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="ACTIF">Actif</option>
              <option value="BLOQUE">Bloqué</option>
            </select>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Niveau</th>
                  <th>XP</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                      <i className="fas fa-spinner fa-spin"></i> Chargement...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm" style={
                            user.role === 'ADMIN'
                              ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)' }
                              : {}
                          }>
                            {(user.nom || '??').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <h5>{user.nom || 'Sans nom'}</h5>
                            <span>{user.email || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: user.role === 'ADMIN' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                          color: user.role === 'ADMIN' ? '#ef4444' : '#6366f1'
                        }}>
                          {user.role === 'ADMIN' ? 'Admin' : 'Étudiant'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: user.statut === 'ACTIF' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: user.statut === 'ACTIF' ? '#10b981' : '#ef4444'
                        }}>
                          {user.statut === 'ACTIF' ? 'Actif' : 'Bloqué'}
                        </span>
                      </td>
                      <td>{user.niveau || 1}</td>
                      <td>{user.xp || 0}</td>
                      <td>{user.pointsActuels || 0}</td>
                      <td>
                        <div className="action-btns">
                          {user.role !== 'ADMIN' && (
                            <button
                              className={`action-btn ${user.statut === 'ACTIF' ? 'reject' : 'approve'}`}
                              onClick={() => handleChangeStatus(user.id)}
                              disabled={statusLoading === user.id}
                              title={user.statut === 'ACTIF' ? 'Bloquer' : 'Débloquer'}
                            >
                              {statusLoading === user.id
                                ? <i className="fas fa-spinner fa-spin"></i>
                                : <i className={`fas ${user.statut === 'ACTIF' ? 'fa-ban' : 'fa-unlock'}`}></i>
                              }
                            </button>
                          )}
                          {user.role !== 'ADMIN' && (
                            <button
                              className="action-btn delete"
                              onClick={() => setShowDeleteModal({ show: true, id: user.id, name: user.nom, error: null })}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal.show && (
        <div className="modal-overlay active" onClick={() => setShowDeleteModal({ show: false, id: null, name: '', error: null })}>
          <div className="modal-dialog sm" onClick={(e) => e.stopPropagation()}>
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
  );
}

export default Users;
