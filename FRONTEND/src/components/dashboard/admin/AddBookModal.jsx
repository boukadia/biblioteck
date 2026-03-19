import React, { useState } from 'react';

const initialForm = {
 titre : "",
image : "",
auteur : "",
isbn : "",
stock : "",
categoryId : "",
};

function AddBookModal({ show, onClose }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Book added:', form);
    setForm(initialForm);
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog" onClick={handleModalClick} onMouseDown={handleModalClick} onTouchStart={handleModalClick}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-plus-circle"></i> Ajouter un nouveau livre
          </h2>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Titre du livre</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Entrez le titre du livre"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Auteur</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Entrez le nom de l'auteur"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  placeholder="Entrez l'ISBN"
                  value={form.isbn}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Cat\u00e9gorie</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">\Élection de la cat\u00e9gorie</option>
                  <option value="fiction">Fiction</option>
                  <option value="science">Science</option>
                  <option value="history">Histoire</option>
                  <option value="philosophy">Philosophie</option>
                  <option value="technology">Technologie</option>
                  <option value="literature">Litt\u00e9rature</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>\Éditeur</label>
                <input
                  type="text"
                  name="publisher"
                  placeholder="Entrez l'\u00e9diteur"
                  value={form.publisher}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ann\u00e9e de publication</label>
                <input
                  type="number"
                  name="year"
                  placeholder="Exemple 2024"
                  value={form.year}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nombre de copies</label>
              <input
                type="number"
                name="copies"
                placeholder="Entrez le nombre de copies"
                value={form.copies}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Entrez la description du livre..."
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-plus"></i> Ajouter un livre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;