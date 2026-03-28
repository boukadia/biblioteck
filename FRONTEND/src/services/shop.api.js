import api from './api';

export async function getRecompenses() {
    const response = await api.get('/shop/');
    return response.data;
}

export async function acheterBonus(id) {
    const response = await api.post(`/shop/${id}/acheter/`);
    return response.data;
}

export async function getMesBonus() {
    const response = await api.get('/shop/mes-bonus');
    return response.data;
}