import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-9xl font-extrabold text-blue-600">
            404
          </h2>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page introuvable
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <div className="mt-8">
          <Link 
            to="/"
            style={{ backgroundColor: '#2563eb', color: 'white', display: 'block' }}
            className="w-full text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
