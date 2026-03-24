import api from './api';

export async function getAdminStats() {
    const response = await api.get('/stats'); 
    return response.data;
}