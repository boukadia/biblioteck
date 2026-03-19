import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/category.api';
import { createBook } from '../../../services/livres.api';

function AddBookModal({ show, onClose, onSuccess }) {
  // Individual state for each field (like Register.jsx)
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);

  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    if (show) {
      loadCategories();
    }
  }, [show]);

  // Individual handleChange functions (like Register.jsx)
  const handleChangeTitre = (e) => {
    setTitre(e.target.value);
  };

  const handleChangeAuteur = (e) => {
    setAuteur(e.target.value);
  };

  const handleChangeIsbn = (e) => {
    setIsbn(e.target.value);
  };

  const handleChangeStock = (e) => {
    setStock(e.target.value);
  };

  const handleChangeCategoryId = (e) => {
    setCategoryId(e.target.value);
  };

  const handleChangeImage = (e) => {
    setImage(e.target.value);
  };

  // Validation function (like Register.jsx)
  const validateForm = () => {
    const newErrors = {};

    if (!titre.trim()) {
      newErrors.titre = "Le titre du livre est requis";
    }

    if (!auteur.trim()) {
      newErrors.auteur = "L'auteur est requis";
    }

    if (!categoryId) {
      newErrors.categoryId = "La catégorie est requise";
    }

    if (!stock) {
      newErrors.stock = "Le nombre de copies est requis";
    } else if (parseInt(stock) <= 0) {
      newErrors.stock = "Le nombre de copies doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit (like Register.jsx)
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
    console.log("dddd", bookData);

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const newBook = await createBook(bookData);
      console.log('Book added:', newBook);

      setMessage({ type: "success", text: "Livre ajouté avec succès" });

      // Show success toast and close modal
      if (onSuccess) {
        onSuccess(newBook);
      }

      // Close modal after showing success message
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.log("BACKEND ERROR:", err);
      console.log("Response:", err.response?.data);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Une erreur est survenue lors de l'ajout du livre";

      setMessage({ type: "danger", text: errorMessage });

      // Keep error message visible
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitre("");
    setAuteur("");
    setIsbn("");
    setStock("");
    setCategoryId("");
    setImage("");
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay active" onClick={handleClose}>
      <div className="modal-dialog" onClick={handleModalClick} onMouseDown={handleModalClick} onTouchStart={handleModalClick}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-plus-circle"></i> Ajouter un nouveau livre
          </h2>
          <button className="close-modal" onClick={handleClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {message.text && (
          <div
            className={`alert alert-${message.type} alert-custom`}
            role="alert"
            style={{ margin: '1rem' }}
          >
            <i
              className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} me-2`}
            ></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Titre du livre</label>
                <input
                  type="text"
                  name="titre"
                  placeholder="Entrez le titre du livre"
                  value={titre}
                  onChange={handleChangeTitre}
                  disabled={loading}
                  className={errors.titre ? "is-invalid" : ""}
                />
                {errors.titre && (
                  <div className="text-danger small mt-1">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.titre}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Auteur</label>
                <input
                  type="text"
                  name="auteur"
                  placeholder="Entrez le nom de l'auteur"
                  value={auteur}
                  onChange={handleChangeAuteur}
                  disabled={loading}
                  className={errors.auteur ? "is-invalid" : ""}
                />
                {errors.auteur && (
                  <div className="text-danger small mt-1">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.auteur}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  placeholder="Entrez l'ISBN"
                  value={isbn}
                  onChange={handleChangeIsbn}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  name="categoryId"
                  value={categoryId}
                  onChange={handleChangeCategoryId}
                  disabled={loading}
                  className={errors.categoryId ? "is-invalid" : ""}
                >
                  <option value="">Sélection de la catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="text-danger small mt-1">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {errors.categoryId}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Nombre de copies (Stock)</label>
              <input
                type="number"
                name="stock"
                placeholder="Entrez le nombre de copies"
                value={stock}
                onChange={handleChangeStock}
                disabled={loading}
                className={errors.stock ? "is-invalid" : ""}
              />
              {errors.stock && (
                <div className="text-danger small mt-1">
                  <i className="fas fa-exclamation-circle me-1"></i>
                  {errors.stock}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>URL Image</label>
              <input
                type="url"
                name="image"
                placeholder="Entrez l'URL de l'image du livre"
                value={image}
                onChange={handleChangeImage}
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
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Ajouter un livre
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;