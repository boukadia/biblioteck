import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';

// Pages
import AdminDashboard from './pages/admin/Dashboard';
import GestionLivres from './pages/admin/GestionLivres';
import ProtectedRoute from './components/protected/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Routes dyal l-Admin (Kolla we7da m-ghlfa b ProtectedRoute) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/livres" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <GestionLivres />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}