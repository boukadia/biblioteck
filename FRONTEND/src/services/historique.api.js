import api from './api';

export async function getMonHistorique() {
    const response = await api.get('/historiques');
    return response.data;
}

export async function getHistoriqueByEtudiant(id) {
    const response = await api.get(`/historiques/etudiant/${id}`);
    return response.data;
}
