import { createSlice } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';

const initialState = {
  books: [],
  currentBook: null,
  userHistory: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBooks: (state, action) => {
      state.books = Array.isArray(action.payload) ? action.payload : [];
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
    },
    setUserHistory: (state, action) => {
      state.userHistory = action.payload || [];
    },
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(book => book._id === action.payload._id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter(book => book._id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setBooks,
  setCurrentBook,
  setUserHistory,
  addBook,
  updateBook,
  deleteBook,
} = bookSlice.actions;

// Async thunks
export const fetchBooks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const books = await bookService.getAllBooks();
    dispatch(setBooks(books));
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchBookById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const book = await bookService.getBookById(id);
    dispatch(setCurrentBook(book));
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createBook = (bookData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const newBook = await bookService.addBook(bookData);
    dispatch(addBook(newBook));
    return newBook;
  } catch (error) {
    dispatch(setError(error));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBookById = (id, bookData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedBook = await bookService.updateBook(id, bookData);
    dispatch(updateBook(updatedBook));
    return updatedBook;
  } catch (error) {
    dispatch(setError(error));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteBookById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await bookService.deleteBook(id);
    dispatch(deleteBook(id));
  } catch (error) {
    dispatch(setError(error));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const borrowBookById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedBook = await bookService.borrowBook(id);
    dispatch(updateBook(updatedBook));
    return updatedBook;
  } catch (error) {
    dispatch(setError(error));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const returnBookById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedBook = await bookService.returnBook(id);
    dispatch(updateBook(updatedBook));
    return updatedBook;
  } catch (error) {
    dispatch(setError(error));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUserHistory = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const history = await bookService.getUserHistory();
    dispatch(setUserHistory(history));
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export default bookSlice.reducer; 