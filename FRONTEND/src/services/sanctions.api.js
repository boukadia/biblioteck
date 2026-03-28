import api from './api';

// ===== Règles de sanctions =====

export async function getReglesSanctions() {
    const response = await api.get('/regle-sanctions');
    return response.data;
}

export async function createRegleSanction(data) {
    const response = await api.post('/regle-sanctions', data);
    return response.data;
}

export async function updateRegleSanction(id, data) {
    const response = await api.patch(`/regle-sanctions/${id}`, data);
    return response.data;
}

export async function deleteRegleSanction(id) {
    const response = await api.delete(`/regle-sanctions/${id}`);
    return response.data;
}

// ===== Sanctions (appliquer + lister) =====

export async function getAllSanctions() {
    const response = await api.get('/sanctions');
    return response.data;
}

export async function appliquerSanction(data) {
    const response = await api.post('/sanctions', data);
    return response.data;
}
