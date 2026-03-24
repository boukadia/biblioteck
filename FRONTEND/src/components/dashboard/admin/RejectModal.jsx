import React, { useState } from 'react';

const rejectReasons = [
  { value: '', label: 'Choisir le motif' },
  { value: 'unavailable', label: "Le livre n'est pas disponible actuellement" },
  { value: 'overdue', label: "L'étudiant a des livres en retard" },
  { value: 'limit', label: "Limite maximale d'emprunts dépassée" },
  { value: 'blocked', label: 'Compte bloqué' },
  { value: 'other', label: 'Autre raison' },
];

function RejectModal({ show, onClose, onConfirm, requestId }) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(requestId, reason, notes);
    setReason('');
    setNotes('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-times-circle" style={{ color: 'var(--danger)' }}></i>
            {' '}Refuser la demande
          </h2>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Motif du refus</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                {rejectReasons.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Notes supplémentaires</label>
              <textarea
                placeholder="Ajouter des notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-danger">
              <i className="fas fa-times"></i> Confirmer le refus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RejectModal;