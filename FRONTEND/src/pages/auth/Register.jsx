import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordStrength, setPasswordStrength] = useState("weak");

  function checkPasswordStrength(password) {
    if (password.length < 6) {
      return "weak";
    } else if (password.length < 10) {
      return "medium";
    } else if (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "strong";
    }
    return "medium";
  }

  function handleChangeNom(e) {
    setNom(e.target.value);
    // if (errors.nom) {
    //     setErrors(function(prev) { return { ...prev, nom: '' }; });
    // }
  }

  function handleChangePrenom(e) {
    setPrenom(e.target.value);
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangeMotDePasse(e) {
    setMotDePasse(e.target.value);
    setPasswordStrength(checkPasswordStrength(e.target.value));
  }

  function handleChangeConfirmPassword(e) {
    setConfirmPassword(e.target.value);
  }

  function validateForm() {
    const newErrors = {};

    if (!prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (prenom.length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!email) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'adresse email est invalide";
    }

    if (!motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (motDePasse.length < 6) {
      newErrors.motDePasse =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (motDePasse !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const userData = {
      nom,
      prenom,
      email,
      motDePasse,
    };

    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await register(userData);
      setMessage({ type: "success", text: "Compte a été créé avec succès" });
      setTimeout(function() {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log(" BACKEND ERROR:", error);
      console.log("Response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Une erreur est survenue lors de la création du compte";

      setMessage({ type: "danger", text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-body">
      <div className="container">
        <div className="auth-container">
          <div className="row g-0">
            <div className="col-lg-5 d-none d-lg-block">
              <div className="auth-image register-bg">
                <div className="auth-image-content">
                  <h2 className="fw-bold mb-4">Rejoignez notre communauté</h2>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="text-start">
                      <h6 className="mb-0 fw-bold">Milliers de livres</h6>
                      <small>Plus de 10 000 livres disponibles</small>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-download"></i>
                    </div>
                    <div className="text-start">
                      <h6 className="mb-0 fw-bold">Emprunt facile</h6>
                      <small>Empruntez en un seul clic</small>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="text-start">
                      <h6 className="mb-0 fw-bold">Alertes intelligentes</h6>
                      <small>Notifications de nouveaux livres</small>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className="text-start">
                      <h6 className="mb-0 fw-bold">Listes de favoris</h6>
                      <small>Enregistrez vos coups de cœur</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="auth-form">
                <div className="text-center mb-4">
                  <i className="fas fa-user-plus logo"></i>
                  <h3 className="fw-bold text-dark">Créer un compte</h3>
                  <p className="text-muted">
                    Inscrivez-vous pour accéder à la bibliothèque
                  </p>
                </div>

                {message.text && (
                  <div
                    className={`alert alert-${message.type} alert-custom`}
                    role="alert"
                  >
                    <i
                      className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} me-2`}
                    ></i>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Prénom</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="prenom"
                          className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                          placeholder="Jean"
                          value={prenom}
                          onChange={handleChangePrenom}
                        />
                      </div>
                      {errors.prenom && (
                        <div className="text-danger small mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.prenom}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nom</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="nom"
                          className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                          placeholder="Dupont"
                          value={nom}
                          onChange={handleChangeNom}
                        />
                      </div>
                      {errors.nom && (
                        <div className="text-danger small mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.nom}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={handleChangeEmail}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mot de passe</label>
                      <div className="input-group position-relative">
                        <span className="input-group-text">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="motDePasse"
                          className={`form-control ${errors.motDePasse ? "is-invalid" : ""}`}
                          placeholder="••••••••"
                          value={motDePasse}
                          onChange={handleChangeMotDePasse}
                        />
                        <span
                          className="password-toggle"
                          onClick={function () {
                            setShowPassword(!showPassword);
                          }}
                        >
                          <i
                            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </span>
                      </div>
                      {motDePasse && (
                        <div
                          className={`password-strength strength-${passwordStrength}`}
                        ></div>
                      )}
                      {errors.motDePasse && (
                        <div className="text-danger small mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.motDePasse}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Confirmer le mot de passe
                      </label>
                      <div className="input-group position-relative">
                        <span className="input-group-text">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={handleChangeConfirmPassword}
                        />
                        <span
                          className="password-toggle"
                          onClick={function () {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        >
                          <i
                            className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </span>
                      </div>
                      {errors.confirmPassword && (
                        <div className="text-danger small mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'inscription */}
                  <button
                    type="submit"
                    className="btn btn-auth w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Création du compte...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        S'inscrire
                      </>
                    )}
                  </button>

                  <p className="text-center mb-0">
                    Vous avez déjà un compte ?{" "}
                    <Link to="/login" className="auth-link">
                      Se connecter
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
