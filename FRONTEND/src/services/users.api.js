import api from './api';

// Get all users (admin)
export async function getAllUsers() {
    const response = await api.get('/users');
    return response.data;
}

// Get single user
export async function getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
}

// Toggle user status (ACTIF <-> BLOQUE)
export async function changeUserStatus(id) {
    const response = await api.patch(`/users/${id}`);
    return response.data;
}

// Update user info
export async function updateUser(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
}

// Delete user
export async function deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

// Get leaderboard
export async function getLeaderboard() {
    const response = await api.get('/users/leaderboard');
    return response.data;
}