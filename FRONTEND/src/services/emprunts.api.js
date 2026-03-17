import api from './api';

export async function emprunter(data) {
    const response = await api.post('/emprunts', data);
    return response.data;
}

export async function getMesEmprunts() {
    const response = await api.get('/emprunts/mes-emprunts');
    return response.data;
}

export async function declarerRetour(id, bonusId) {
    const response = await api.patch('/emprunts/retour/' + id, { 
        bonusProtectionId: bonusId 
    });
    return response.data;
}