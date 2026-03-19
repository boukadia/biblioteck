import React, { useState } from 'react';
const initialRequests = [
  {
    id: 1,
    user: { initials: 'JS', name: 'John Smith', level: 'Level 5', gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))' },
    book: { title: "Sophie's World", author: 'Jostein Gaarder', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    time: '2 hours ago',
  },
  {
    id: 2,
    user: { initials: 'SJ', name: 'Sarah Johnson', level: 'Level 8', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    book: { title: 'The Alchemist', author: 'Paulo Coelho', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' },
    time: '4 hours ago',
  },
  {
    id: 3,
    user: { initials: 'MK', name: 'Mike Kennedy', level: 'Level 3', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    book: { title: '1984', author: 'George Orwell', gradient: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
    time: '5 hours ago',
  },
];

function PendingLoans({empruntsEnAttente}) {
console.log('.........',empruntsEnAttente);

  const handleApprove = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleReject = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>
          <i className="fas fa-clock" style={{ color: 'var(--secondary)' }}></i>
          Demandes d'emprunt en attente
          <span className="count">{empruntsEnAttente.length}</span>
        </h3>
        <a href="#!" className="btn btn-sm btn-outline">Voir tout</a>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Livre</th>
              <th>Date de demande</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {empruntsEnAttente.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm" style={{ background: initialRequests[0].user.gradient }}>
                      {emp.utilisateur.initials}
                    </div>
                    <div className="user-details">
                      <h5>{emp.utilisateur.nom}</h5>
                      <span>{emp.utilisateur.niveau}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="book-cell">
                    <div className="book-cover-sm" style={{ background: initialRequests[0].book.gradient }}></div>
                    <div className="book-details">
                      <h5>{emp.livre.titre}</h5>
                      <span>{emp.livre.auteur}</span>
                    </div>
                  </div>
                </td>
                <td>{emp.dateEmprunt}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="action-btn approve"
                      title="Approve"
                      onClick={() => handleApprove(emp.id)}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      className="action-btn reject"
                      title="Reject"
                      onClick={() => handleReject(emp.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {empruntsEnAttente.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4" style={{ color: 'var(--gray)' }}>
                  لا توجد طلبات معلقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingLoans;