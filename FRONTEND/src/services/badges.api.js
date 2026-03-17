import api from './api';

export async function getMesBadges() {
    const response = await api.get('/badges/mes-badges');
    return response.data;
}

export async function getAllBadges() {
    const response = await api.get('/badges');
    return response.data;
}

export async function getBadgeById(id) {
    const response = await api.get('/badges/' + id);
    return response.data;
}