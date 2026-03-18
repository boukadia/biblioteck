import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';
import { useAuth } from '../../context/AuthContext';


export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    
    const [errors, setErrors] = useState({});
    
    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    
    const [message, setMessage] = useState({ type: '', text: '' });

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    };

    function handleChangeMotDePasse(e) {
        setMotDePasse(e.target.value);
    };

    function validateForm() {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = 'L\'adresse email est requise';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'L\'adresse email est invalide';
        }
        
        if (!motDePasse) {
            newErrors.motDePasse = 'Le mot de passe est requis';
        } else if (motDePasse.length < 6) {
            newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            await login(email, motDePasse);
            setMessage({ type: 'success', text: 'Connexion réussie! Redirection...' });
            setTimeout(function() {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.log('❌ BACKEND ERROR:', error);
            console.log('Response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 'Une erreur est survenue lors de la connexion';
            
            setMessage({ type: 'danger', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-body">
            <div className="container">
                <div className="auth-container">
                    <div className="row g-0">
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="auth-image login-bg">
                                <div className="auth-image-content text-center">
                                    <i className="fas fa-book-open book-icon"></i>
                                    <h2 className="fw-bold mb-3">Bon retour !</h2>
                                    <p className="mb-4">Ravi de vous revoir dans la Bibliothèque du Savoir</p>
                                    
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <i className="fas fa-book"></i>
                                        </div>
                                        <div className="text-start">
                                            <h6 className="mb-0 fw-bold">Milliers de livres</h6>
                                            <small>Vous attendent pour être explorés</small>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <i className="fas fa-clock"></i>
                                        </div>
                                        <div className="text-start">
                                            <h6 className="mb-0 fw-bold">Disponible 24/7</h6>
                                            <small>Lisez à tout moment</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-7">
                            <div className="auth-form">
                                <div className="text-center mb-4">
                                    <i className="fas fa-book-reader logo"></i>
                                    <h3 className="fw-bold text-dark">Connexion</h3>
                                    <p className="text-muted">Entrez vos informations pour accéder à votre compte</p>
                                </div>
                                
                                {message.text && (
                                    <div className={`alert alert-${message.type} alert-custom`} role="alert">
                                        <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                                        {message.text}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="example@email.com"
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
                                    
                                    <div className="mb-4">
                                        <label className="form-label">Mot de passe</label>
                                        <div className="input-group position-relative">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="motDePasse"
                                                className={`form-control ${errors.motDePasse ? 'is-invalid' : ''}`}
                                                placeholder="••••••••"
                                                value={motDePasse}
                                                onChange={handleChangeMotDePasse}
                                            />
                                            <span 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                        {errors.motDePasse && (
                                            <div className="text-danger small mt-1">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {errors.motDePasse}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <Link to="/forgot-password" className="auth-link float-end">
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-auth w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Connexion en cours...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Se connecter
                                            </>
                                        )}
                                    </button>
                                    
                                    <p className="text-center mb-0">
                                        Pas encore de compte ?{' '}
                                        <Link to="/register" className="auth-link">
                                            S'inscrire
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