import api from './api';

export const bookService = {
  async getAllBooks() {
    try {
      const response = await api.get('/books');
      console.log('API Response:', response.data); // Debug log
      
      // Check if response.data exists and has the expected structure
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // If the response has a books array, return it
      if (Array.isArray(response.data.books)) {
        return response.data.books;
      }
      
      // If the response is directly an array, return it
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // If we get here, the response structure is unexpected
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error in getAllBooks:', error);
      throw error.response?.data || { message: 'Error fetching books' };
    }
  },

  async getBookById(id) {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching book details' };
    }
  },

  async addBook(bookData) {
    try {
      const response = await api.post('/books', bookData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error adding book' };
    }
  },

  async updateBook(id, bookData) {
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach(key => {
        if (key === 'bookImage' && bookData[key]) {
          formData.append('bookImage', bookData[key]);
        } else {
          formData.append(key, bookData[key]);
        }
      });
      const response = await api.put(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating book' };
    }
  },

  async deleteBook(id) {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting book' };
    }
  },

  async borrowBook(id) {
    try {
      const response = await api.post(`/books/${id}/borrow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error borrowing book' };
    }
  },

  async returnBook(id) {
    try {
      const response = await api.post(`/books/${id}/return`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error returning book' };
    }
  },

  async getUserHistory() {
    try {
      const response = await api.get('/books/user/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user history' };
    }
  }
}; 