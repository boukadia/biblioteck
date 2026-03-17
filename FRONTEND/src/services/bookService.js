import api from './api';

export default {
  getAllBooks() {
    return api.get('/livres');
  },
  getBookById(id) {
    return api.get('/livres/' + id);
  },
  searchBooks(query) {
    return api.get('/livres/search?q=' + query);
  },
  addBook(bookData) {
    return api.post('/livres', bookData);
  }
};