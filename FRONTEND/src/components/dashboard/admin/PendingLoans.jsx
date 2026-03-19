import React, { useState, useEffect } from 'react';
import { validerEmprunt, annule } from '../../../services/emprunts.api';
const initialRequests = [
  {
    id: 1,
    user: {  gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))' },
    book: {  gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
   
  },
  
];

function PendingLoans({empruntsEnAttente}) {
  const [newEmpruntsEnAttente,setNewEmpruntsEnAttente]=useState(empruntsEnAttente)

  useEffect(() => {
    setNewEmpruntsEnAttente(empruntsEnAttente);
  }, [empruntsEnAttente]);

console.log("emen",newEmpruntsEnAttente);

  async function  handleApprove(id){
    await validerEmprunt(id)
    setNewEmpruntsEnAttente(newEmpruntsEnAttente.filter((emp) => emp.id !== id));

  } 

  async function handleReject (id){
    await annule(id)
    setNewEmpruntsEnAttente(newEmpruntsEnAttente.filter((emp) => emp.id !== id));

    
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
            {newEmpruntsEnAttente.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm" style={{ background: initialRequests[0].user.gradient }}>
                      {emp.utilisateur.initials}
                    </div>
                    <div className="user-details">
                      <h5>{emp.utilisateur.nom}</h5>
                      <span>Level {emp.utilisateur.niveau}</span>
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