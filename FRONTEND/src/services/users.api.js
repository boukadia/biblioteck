import api from './api';

export async function getLeaderboard() {
    const response = await api.get('/users/leaderboard');
    return response.data;
}