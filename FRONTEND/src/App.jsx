import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Livres from './pages/admin/Livres'

// Pages
import StudentDashboard from './pages/etudiant/Dashboard';
// import GestionLivres from './pages/admin/GestionLivres';
import ProtectedRoute from './components/protected/ProtectedRoute';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Emprunts from './pages/admin/emprunts';
import EmpruntsEnRetard from './pages/admin/EmpruntsEnRetard';
import EmpruntsEnAttenteRetour from './pages/admin/EmpruntsEnAttenteRetour';
import TousLesEmprunts from './pages/admin/TousLesEmprunts';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users';
import Etudiants from './pages/admin/Etudiants';
import Inventaire from './pages/admin/Inventaire';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/Etudiant" 
            element={
              // <ProtectedRoute allowedRole="ETUDIANT">
                <StudentDashboard />
              // </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <DashboardAdmin />
              // </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/livres" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Livres />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/emprunts" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Emprunts />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/retards" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <EmpruntsEnRetard />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/emprunts-en-attente-retour" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <EmpruntsEnAttenteRetour />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tous-les-emprunts" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <TousLesEmprunts />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Categories />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Users />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/etudiants" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Etudiants />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/inventaire" 
            element={
              // <ProtectedRoute allowedRole="ADMIN">
                <Inventaire />
              // </ProtectedRoute>
            } 
          />
          
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}