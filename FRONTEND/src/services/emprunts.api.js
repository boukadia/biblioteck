import api from './api';

export async function emprunter(data) {
    const response = await api.post('/emprunts', data);
    return response.data;
}

export async function getMesEmprunts() {
    const response = await api.get('/emprunts/mes-emprunts');
    return response.data;
}

export async function getAllEmprunts() {
    const response = await api.get('/emprunts/all');
    return response.data;
}
export async function getEmpruntsEnRetard() {
    const response = await api.get('/emprunts/en-retard');
    return response.data;
}
export async function getEmpruntsEnAttente() {
    const response = await api.get('/emprunts/en-attente');
    return response.data;
}
export async function validerEmprunt(id) {
    const response = await api.patch(`/emprunts/${id}/valider`);
    return response.data;
}
 export async function annule(id) {
    const response = await api.patch(`/emprunts/${id}/annuler`);
    return response.data;

 }

export async function retournerLivre(id) {
    const response = await api.patch(`/emprunts/${id}/retour`);
    return response.data;
}

export async function declarerRetour(id, bonusId) {
    const response = await api.patch('/emprunts/retour/' + id, { 
        bonusProtectionId: bonusId 
    });
    return response.data;
}