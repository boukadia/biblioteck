import api from './api';

export async function getAllBooks() {
    const response = await api.get('/books');
    return response.data;
}

export async function getBookById(id) {
    const response = await api.get('/books/' + id);
    return response.data;
}

export async function searchBooks(query) {
    const response = await api.get('/books/search?q=' + query);
    return response.data;
}