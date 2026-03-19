import React, { useState, useEffect } from 'react';
import { updateBook } from '../../../services/livres.api';
import { getCategories } from '../../../services/category.api';

function EditBookModal({ show, book, onClose, onSuccess }) {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Populate form when book changes
  useEffect(() => {
    if (book && show) {
      setTitre(book.titre || "");
      setAuteur(book.auteur || "");
      setIsbn(book.isbn || "");
      setStock(book.stock?.toString() || "");
      setCategoryId(book.categoryId?.toString() || "");
      setImage(book.image || "");
      setErrors({});
      setMessage({ type: "", text: "" });
    }
  }, [book, show]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }

    if (!auteur.trim()) {
      newErrors.auteur = "L'auteur est requis";
    }

    if (!categoryId) {
      newErrors.categoryId = "La catégorie est requise";
    }

    if (!stock || parseInt(stock) < 0) {
      newErrors.stock = "Le stock doit être un nombre positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookData = {
      titre,
      auteur,
      isbn,
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      image
    };

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updatedBook = await updateBook(book.id, bookData);
      setMessage({ type: "success", text: "Livre modifié avec succès" });

      if (onSuccess) {
        onSuccess(updatedBook);
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la modification";

      setMessage({ type: "danger", text: errorMessage });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setMessage({ type: "", text: "" });
    onClose();
  };

  if (!show || !book) return null;

  return (
    <div className="modal-overlay active" onClick={handleClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-edit"></i> Modifier le livre
          </h2>
          <button className="close-modal" onClick={handleClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} alert-custom`} role="alert" style={{ margin: '1rem' }}>
            <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} me-2`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  disabled={loading}
                  className={errors.titre ? "is-invalid" : ""}
                />
                {errors.titre && <div className="text-danger small mt-1"><i className="fas fa-exclamation-circle me-1"></i>{errors.titre}</div>}
              </div>
              <div className="form-group">
                <label>Auteur</label>
                <input
                  type="text"
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  disabled={loading}
                  className={errors.auteur ? "is-invalid" : ""}
                />
                {errors.auteur && <div className="text-danger small mt-1"><i className="fas fa-exclamation-circle me-1"></i>{errors.auteur}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loading}
                  className={errors.categoryId ? "is-invalid" : ""}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <div className="text-danger small mt-1"><i className="fas fa-exclamation-circle me-1"></i>{errors.categoryId}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={loading}
                className={errors.stock ? "is-invalid" : ""}
              />
              {errors.stock && <div className="text-danger small mt-1"><i className="fas fa-exclamation-circle me-1"></i>{errors.stock}</div>}
            </div>

            <div className="form-group">
              <label>URL Image</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Modification en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookModal;
