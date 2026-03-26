import api from './api';

export async function getMaListe() {
  const response = await api.get('/wishlist');
  return response.data;
}

export async function ajouterALaWishlist(livreId) {
  const response = await api.post('/wishlist', { livreId });
  return response.data;
}

export async function retirerDeLaWishlist(livreId) {
  const response = await api.delete(`/wishlist/${livreId}`);
  return response.data;
}

